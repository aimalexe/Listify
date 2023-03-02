const app = require('express')();
const config = require('config');
const winston = require('winston');

require('./startups/logging')(); //? for logging
require('./startups/connectDatabase')(); //? Connect with database
require('./startups/routes')(app);  //? Endpoints are included from here.

const server = app.listen(config.get("PORT"), ()=>{
    winston.info(`Listening on port ${config.get("PORT")} for ${config.get("environment")}`);
});

module.exports = server;