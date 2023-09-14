import { isDevelopment } from '../envs.js';
import winston from 'winston';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

const level = () => {
    return isDevelopment ? 'debug' : 'warn'
}

winston.addColors(colors)

const format = winston.format((info) => {
    const { timestamp, message, level } = info;
    info.message = `[${timestamp}] [${level.toUpperCase()}] - `;

    if (info.label) {
        info.message += `[${info.label}] - `;
    }

    info.message += `${message}`;

    if (info.error) {
        info.message += `\n${info.error}`;
    }

    return info;
})();

const logger = winston.createLogger({
    level: level(),
    levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        format,
        winston.format.printf((info) => info.message)
    ),
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        })
    ]
})

if (!isDevelopment) {
    logger.add(new winston.transports.File({
        filename: 'logs/all.log'
    }))
} else {
    logger.add(new winston.transports.Console({
        format: winston.format.colorize({ all: true }),
    }))
}

export default logger;