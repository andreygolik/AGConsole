const winston = require('winston');

winston.emitErrs = true;

const logger = new winston.Logger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      level: 'warning',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      timestamp: false,
      json: false,
      colorize: true,
    }),

    new winston.transports.File({
      name: 'main-file',
      filename: './logs/main.log',
      maxSize: 1000000,
      maxFiles: 10,
      tailable: true,
      zippedArchive: false,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      timestamp: true,
      json: false,
      colorize: false,
    }),
    new winston.transports.File({
      level: 'error',
      name: 'error-file',
      filename: './logs/error.log',
      maxSize: 1000000,
      maxFiles: 10,
      tailable: true,
      zippedArchive: false,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      timestamp: true,
      json: false,
      colorize: false,
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message) => {
    logger.verbose(message.slice(0, -1));
  },
};

module.exports = logger;
