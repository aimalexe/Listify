const app = require('express')();
const config = require('config');
const winston = require('winston');

require('./startups/logging')(); //? call for default winston logging
require('./startups/connectDatabase')(); //? Connect with database
require('./startups/routes')(app);  //? Endpoints are included from here.
require('./startups/production')(app); //? Middleware for production.

const server = app.listen(config.get("PORT"), ()=>{
    winston.info(`Listening on port ${config.get("PORT")} for ${config.get("environment")}`);
});

module.exports = server;