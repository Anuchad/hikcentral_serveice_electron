const { createLogger, format, transports } = require("winston");
// const fs = require('fs');
// const path = require('path');
// const logDir = 'log';

// const filename = path.join(logDir, 'results.log');

//logging
const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "./src/log/info.log",
      handleExceptions: true,
      json: false,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // new transports.Http({
    //   host: 'localhost',
    //   port: 3000,
    // }),
  ],
});

function logResponseBody(req, res, next) {
  var oldWrite = res.write,
    oldEnd = res.end;

  var chunks = [];

  res.write = function (chunk) {
    chunks.push(Buffer.from(chunk));
    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) chunks.push(Buffer.from(chunk));

    var body = Buffer.concat(chunks).toString("utf8");
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    var ua = req.headers["user-agent"];
    try {
      console.log("start");
      console.log(".");
      console.log(".");
      logger.info(`****** Start process ******`);
      logger.info(`${req.method} ${req.originalUrl} ${ip} ${ua}`);
      console.log(
        "--------------------------------------------------------------------------"
      );
      logger.info(`header:${JSON.stringify(req.headers)}`);
      console.log(
        "--------------------------------------------------------------------------"
      );
      logger.info(`request:${JSON.stringify(req.body)}`);
      console.log(
        "-------------------------------------------------------------------------------"
      );
      logger.info(`response:${body}`);
      logger.info(`****** End process ****** \n`);
      console.log(".");
      console.log(".");
      console.log(".");
      console.log("end");
    } catch (err) {
      logger.error(err);
    }

    oldEnd.apply(res, arguments);
  };

  next();
}

module.exports = {
  logResponseBody,
};
