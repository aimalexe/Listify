const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston')

module.exports = function(){
    const userName = config.get("database.databaseUserName");
    const password = config.get("database.password");
    const collectionName = config.get("database.collectionName");
    const cluster = config.get("database.clusterName");
    
    const connectionString = `mongodb+srv://${userName}:${password}@${cluster}.ikmhi23.mongodb.net/${collectionName}?retryWrites=true&w=majority`;
    
    mongoose.connect(connectionString)
            .then(() => winston.info(`Connected in Mongodb Atlas to ${collectionName}`))
            .catch( err => winston.error(err));
}