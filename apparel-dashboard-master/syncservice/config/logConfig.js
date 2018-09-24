'use strict';
const winston = require('winston');
const fs = require('fs');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
//const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleString();


const logger = createLogger({
  format: combine(
    label({ label: 'SyncService' }),
    timestamp(),
    prettyPrint()
  ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ 
        filename:  logDir + '/logs.log',
        maxsize: 5242880, //5MB
        maxFiles: 5,
    })
    ]
  });


process.on('uncaughtException', function (err) {
  // logger.error('uncaughtException', { message : err.message, stack : err.stack }); // logging with MetaData
  // process.exit(1); // exit with failure
});
module.exports =logger;
