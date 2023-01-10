const mongoose = require('mongoose');
const config = require('config');

module.exports = function(){
    const userName = config.get("database.databaseUserName");
    const password = config.get("database.password");
    const collectionName = config.get("database.collectionName");
    
    const connectionString = `mongodb+srv://${userName}:${password}@learningcluster.ikmhi23.mongodb.net/${collectionName}?retryWrites=true&w=majority`;
    
    mongoose.connect(connectionString)
            .then(() => console.info(`Connected in Mongodb Atlas to ${collectionName}`))
            .catch( err => console.error(err));
}