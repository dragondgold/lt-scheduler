import config from './config/config';
import { LtJob } from './typings/job';
import { getQueue, setQueuesEventListener } from './util/queues';
import { getSqsAttributes, getSqsMessage, getSqsUrl, removeSqsMessage } from './util/sqs';
import { connect } from '@/database';
import { buildLogger } from '@/logger';
const logger = buildLogger(module);

(async () => {
    logger.info(`Redis is on port ${config.REDIS_PORT} at ${config.REDIS_HOST}`);
    await connect();

    setQueuesEventListener((event, queue, jobId, args) => {
        // TODO: update job status in db
        logger.info('Received event ' + event);
    });

    const queueUrl = await getSqsUrl(config.SQS_NAME);
    if (queueUrl) {
        const sqsAttr = await getSqsAttributes(queueUrl);
        if (sqsAttr) {
            logger.info(`There are approximately ${sqsAttr.ApproximateNumberOfMessages} messages in the SQS queue`);
        }
        logger.info(`Starting message reception from SQS at '${queueUrl}'`);

        // Wait for messages in the queue
        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                const messages = await getSqsMessage({
                    QueueUrl: queueUrl,
                    AttributeNames: ['All'],
                    MessageAttributeNames: ['All'],
                    MaxNumberOfMessages: 10,
                    VisibilityTimeout: 60,
                    WaitTimeSeconds: 20 // 20 seconds is the maximum wait time
                });

                if (messages) {
                    logger.info(`Received ${messages.length} messages from SQS`);
                    for (const message of messages) {
                        if (message.ReceiptHandle && message.Body) {
                            logger.info(`Received message with id ${message.MessageId}`);

                            try {
                                // Parse the job and add it to bull
                                const job = JSON.parse(message.Body) as LtJob;
                                const bullQueue = await getQueue(job.queueName, {
                                    redis: {
                                        port: config.REDIS_PORT,
                                        host: config.REDIS_HOST
                                    }
                                });

                                // Parse data JSON if available
                                if (job.data) {
                                    job.data = JSON.parse(job.data);
                                }

                                // Override job id
                                job.options = job.options || {};
                                job.options.jobId = job.id;

                                if (job.name) {
                                    await bullQueue.add(job.name, job.data, job.options);
                                } else {
                                    await bullQueue.add(job.data, job.options);
                                }

                                // Now that the job has been added, remove it from SQS
                                logger.info(`Removing message with id ${message.MessageId}`);
                                await removeSqsMessage(queueUrl, message.ReceiptHandle);
                            } catch (error) {
                                logger.error(`Error while processing message ${message.MessageId}:`, error);
                            }
                        }
                    }
                }
            } catch (error) {
                logger.error('Error while processing message:', error);
            }
        }
    } else {
        logger.error(`Couldn't get URL for SQS queue named '${config.SQS_NAME}'`);
        process.exit(1);
    }
})();
