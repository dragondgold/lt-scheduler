import { JobOptions } from 'bull';

export interface LtJob {
    // Name of the bull.js queue to add this job to
    queueName: string;

    // Job name for bull.js
    name?: string;

    // Unique id that identifies this job, this MUST be unique
    id: string;

    // Job options for bull.js
    options?: JobOptions;

    // JSON data for this job
    data: string;
}
