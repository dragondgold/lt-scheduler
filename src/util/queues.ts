import Queue from 'bull';
import { buildLogger } from '@/logger';
const logger = buildLogger(module);

type EventListener = (
    event: 'waiting' | 'active' | 'stalled' | 'progress' | 'completed' | 'failed' | 'resumed' | 'removed',
    queue: Queue.Queue,
    jobId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
) => void;

const queues: Queue.Queue[] = [];
let eventListener: EventListener | undefined = undefined;

const registerQueueListeners = (queue: Queue.Queue) => {
    queue
        .on('global:waiting', function (jobId: string) {
            // A Job is waiting to be processed as soon as a worker is idling.
            eventListener?.('waiting', queue, jobId);
        })

        .on('global:active', function (jobId: string, jobPromise) {
            // A job has started. You can use `jobPromise.cancel() to abort it.
            eventListener?.('active', queue, jobId, jobPromise);
        })

        .on('global:stalled', function (jobId: string) {
            // A job has been marked as stalled. This is useful for debugging job
            // workers that crash or pause the event loop.
            eventListener?.('stalled', queue, jobId);
        })

        .on('global:progress', function (jobId: string, progress) {
            // A job's progress was updated!
            eventListener?.('progress', queue, jobId, progress);
        })

        .on('global:completed', function (jobId: string, result) {
            // A job successfully completed with a `result`.
            eventListener?.('completed', queue, jobId, result);
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('global:failed', function (jobId: string, err: any) {
            // A job failed with reason `err`!
            eventListener?.('failed', queue, jobId, err);
        })

        .on('global:resumed', function (jobId: string) {
            // The queue has been resumed.
            eventListener?.('resumed', queue, jobId);
        })

        .on('global:removed', function (jobId: string) {
            // A job successfully removed.
            eventListener?.('removed', queue, jobId);
        });
};

export const setQueuesEventListener = (listener: EventListener): void => {
    eventListener = listener;
};

export const getQueue = async (name: string, options?: Queue.QueueOptions): Promise<Queue.Queue> => {
    const queue = queues.find((q) => q.name === name);
    if (!queue) {
        logger.info(`Connecting to queue ${name}`);

        const bullQueue = new Queue(name, options);
        await bullQueue.isReady();
        registerQueueListeners(bullQueue);

        logger.info(`Connected to queue '${bullQueue.name}'`);
        queues.push(bullQueue);
        return bullQueue;
    }

    return queue;
};
