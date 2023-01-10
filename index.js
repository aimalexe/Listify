const app = require('express')();
const config = require('config');

require('./startups/connectDatabase')();
require('./startups/routes')(app);

const server = app.listen(config.get("PORT"), ()=>{
    console.info(`Listening on port ${config.get("PORT")} for ${config.get("environment")}`);
});

module.exports = server;