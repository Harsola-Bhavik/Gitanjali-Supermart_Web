const winston = require('winston');
const env = require('./env');

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const transports = [];

if (env.env !== 'development') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 20971520, // 20MB
      maxFiles: '14d',
    }),
    new winston.transports.File({
      filename: 'logs/all.log',
      maxsize: 20971520,
      maxFiles: '14d',
    })
  );
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    })
  );
}

const logger = winston.createLogger({
  level: env.logger.level,
  levels: winston.config.npm.levels,
  format,
  transports,
});

module.exports = logger;
