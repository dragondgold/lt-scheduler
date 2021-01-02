import { createConnection, ConnectionOptions } from 'typeorm';
import dbConfig = require('@/database/dbConfig');
import { buildLogger } from '@/logger';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
const logger = buildLogger(module);

type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

export const connect = async function (): Promise<void> {
    try {
        const config = dbConfig as DeepWriteable<PostgresConnectionOptions>;

        // Read configuration from environment variables if available
        if (process.env.POSTGRES_PORT) {
            config.port = parseInt(process.env.POSTGRES_PORT);
        }
        if (process.env.POSTGRES_HOST) {
            config.host = process.env.POSTGRES_HOST;
        }
        if (process.env.POSTGRES_USERNAME) {
            config.username = process.env.POSTGRES_USERNAME;
        }
        if (process.env.POSTGRES_PASSWORD) {
            config.password = process.env.POSTGRES_PASSWORD;
        }

        logger.info(`Connecting to database at ${config.host}:${config.port} with user ${config.username}`);
        await createConnection(config as ConnectionOptions);
        logger.info('Connected to database');
    } catch (e) {
        logger.error('Failed connecting to database: ', e);
        throw e;
    }
};
