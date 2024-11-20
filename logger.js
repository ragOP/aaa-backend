const winston = require('winston');
const { combine, timestamp, json, colorize, printf } = winston.format;
const { createLogger, transports } = winston;

const consoleLogFormat = combine(
  colorize(),
  printf(({ level, message }) => {
    return `${level}: ${message}`;
  })
);

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({ filename: "app.log" }),
  ],
});

module.exports = logger;
