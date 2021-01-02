/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

// These are the database settings for production
const devDbConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'lt_scheduler',
    username: 'lt_scheduler',
    password: '12345678',
    connectTimeoutMS: 60000,
    synchronize: false,
    migrationsRun: false,
    logging: false,
    logger: 'file',
    migrations: [path.resolve(__dirname, '../migrations/*.ts')],
    cli: {
        entitiesDir: './src/database/entity',
        migrationsDir: './src/database/migrations'
    }
};

module.exports = devDbConfig;
