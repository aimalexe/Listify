const config = require('config');
const winston = require('winston');


//A custom logger which can be used;
/*
const logger = new winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: '../logs/combined.log' })
    ]
});
*/
module.exports = function () {
    //? An Event listener and handler of uncaught errors
    process.on('uncaughtException', (excep) => {
        //throw excep;
        winston.error(excep);
    });

    winston.exceptions.handle(
        new winston.transports.File({
            filename: "./logs/uncaughtExceptions.log",
            level: "info",
            colorize: true,
            handleExceptions: true
        })
    );

    //? Event Listener and Handler of Unhandled Rejections.
    process.on('unhandledRejection', (excep)=>{
        //throw excep;
        winston.error(excep);
    });

    winston.add(
        new winston.transports.File({
            filename: "./logs/unhandledRejections.log",
            level: "info",
            handleRejections: true
        })
    );

    //? Logging Errors in Development
    if(config.get('environment') === 'development'){
        winston.add(
            new winston.transports.File({
                filename: "./logs/developmentLogs.log",
                level: "verbose",
                //handleExceptions: true
            })
        );
    }

    //? Logging Errors in testing
    if(config.get('environment') === 'testing'){
        winston.add(new winston.transports.File({
            filename: "./logs/testingLogs.log"
        }));
    }

    //? Adding logs to console also
    winston.add(new winston.transports.Console({
        format: winston.format.simple(),
        colorize: true,
        prettyPrint: true
    }));
}