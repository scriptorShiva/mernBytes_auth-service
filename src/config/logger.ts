import winston from 'winston';
import { Config } from '.'; // Import your application's configuration

const logger = winston.createLogger({
    level: 'info', // Minimum log level
    defaultMeta: {
        serviceName: 'auth-service', // Service name or any default metadata
    },
    transports: [
        new winston.transports.File({
            dirname: 'logs',
            filename: 'combined.log',
            level: 'info',
            silent: Config.NODE_ENV === 'development', // Disable logs in the 'developement' environment
        }),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'error.log',
            level: 'error',
            silent: Config.NODE_ENV === 'test',
        }),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
    ],
});

export default logger;
