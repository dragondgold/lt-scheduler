/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

// These are the database settings for production
const prodDbConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'lt_scheduler',
    username: 'lt_scheduler',
    connectTimeoutMS: 60000,
    // Don't synchronize database in production
    synchronize: false,
    migrationsRun: false,
    logging: false,
    logger: 'file',
    migrations: [path.resolve(__dirname, '../migrations/*.ts')]
};

module.exports = prodDbConfig;
