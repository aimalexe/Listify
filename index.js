const app = require('express')();
const config = require('config');

require('./startups/connectDatabase')(); //? Connect with database
require('./startups/routes')(app);  //? Endpoints are included from here.
require('./startups/production')(app); //?m Middleware for production.

const server = app.listen(config.get("PORT"), ()=>{
    console.info(`Listening on port ${config.get("PORT")} for ${config.get("environment")}`);
});

module.exports = server;