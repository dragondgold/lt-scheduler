import { createLogger, format, transports, Logger } from 'winston';

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const buildLogger = (callingModule: NodeModule): Logger => {
    const loggerFormat = format.combine(
        format.errors({ stack: true }),
        format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss'
        }),
        format.printf((info) => {
            if (info.stack) {
                return `${info.timestamp} ${info.level} - ${callingModule.id}: ${info.message} - ${info.stack}`;
            }
            return `${info.timestamp} ${info.level} - ${callingModule.id}: ${info.message}`;
        })
    );

    return createLogger({
        level: 'info',
        transports: [
            new transports.Console({
                format: format.combine(format.colorize(), loggerFormat)
            })
        ]
    });
};
