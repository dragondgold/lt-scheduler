export {};

declare global {
    namespace NodeJS {
        export interface ProcessEnv {
            REDIS_PORT: string;
            REDIS_HOST: string;
            AWS_ACCESS_KEY: string;
            AWS_SECRET_KEY: string;
            SQS_REGION: string;
            SQS_NAME: string;
            NODE_ENV: 'development' | 'production';
            POSTGRES_PORT?: string;
            POSTGRES_HOST?: string;
            POSTGRES_USERNAME?: string;
            POSTGRES_PASSWORD?: string;
        }
    }
}
