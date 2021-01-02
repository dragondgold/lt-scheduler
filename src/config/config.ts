const config = {
    REDIS_PORT: parseInt(process.env.REDIS_PORT),
    REDIS_HOST: process.env.REDIS_HOST,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    SQS_REGION: process.env.SQS_REGION,
    SQS_NAME: process.env.SQS_NAME
};

export default config;
