import AWS from 'aws-sdk';
import { MessageList, QueueAttributeMap } from 'aws-sdk/clients/sqs';
import config from './../config/config';

export const getSqsUrl = async (queueName: string): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
        const sqs = new AWS.SQS({
            region: config.SQS_REGION,
            apiVersion: '2012-11-05',
            accessKeyId: config.AWS_ACCESS_KEY,
            secretAccessKey: config.AWS_SECRET_KEY
        });

        sqs.getQueueUrl(
            {
                QueueName: queueName
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.QueueUrl);
                }
            }
        );
    });
};

export const getSqsAttributes = async (queueUrl: string): Promise<QueueAttributeMap | undefined> => {
    return new Promise((resolve, reject) => {
        const sqs = new AWS.SQS({
            region: config.SQS_REGION,
            apiVersion: '2012-11-05',
            accessKeyId: config.AWS_ACCESS_KEY,
            secretAccessKey: config.AWS_SECRET_KEY
        });

        sqs.getQueueAttributes(
            {
                QueueUrl: queueUrl,
                AttributeNames: ['All']
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Attributes);
                }
            }
        );
    });
};

export const getSqsMessage = async (params: AWS.SQS.ReceiveMessageRequest): Promise<MessageList | undefined> => {
    return new Promise((resolve, reject) => {
        const sqs = new AWS.SQS({
            region: config.SQS_REGION,
            apiVersion: '2012-11-05',
            accessKeyId: config.AWS_ACCESS_KEY,
            secretAccessKey: config.AWS_SECRET_KEY
        });

        sqs.receiveMessage(params, function (err, data) {
            if (err) {
                reject(err);
            } else if (data.Messages) {
                resolve(data.Messages);
            } else {
                resolve(undefined);
            }
        });
    });
};

export const removeSqsMessage = async (queueUrl: string, messageHandle: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const sqs = new AWS.SQS({
            region: config.SQS_REGION,
            apiVersion: '2012-11-05',
            accessKeyId: config.AWS_ACCESS_KEY,
            secretAccessKey: config.AWS_SECRET_KEY
        });
        sqs.deleteMessage(
            {
                QueueUrl: queueUrl,
                ReceiptHandle: messageHandle
            },
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
};
