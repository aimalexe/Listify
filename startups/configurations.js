const config = require('config');

module.exports = function(){
    if(!config.get("port"))
        throw new Error('FATAL ERROR: PORT is not defined.');
        
    if(!config.get("jwtPrivateKey"))
        throw new Error('FATAL ERROR: JWT PRIVATE KEY is not defined.');

    if(!config.get("environment"))
        throw new Error('FATAL ERROR: environment is not defined.');


    if(!config.get("database.databaseUserName"))
        throw new Error('FATAL ERROR: DATABASE USERNAME is not defined.');

    if(!config.get("database.password"))
        throw new Error('FATAL ERROR: DATABASE PASSWORD is not defined.');

    if(!config.get("database.collectionName"))
        throw new Error('FATAL ERROR: DATABASE COLLECTION is not defined.');

    if(!config.get("database.clusterName"))
        throw new Error('FATAL ERROR: DATABASE CLUSTER is not defined.');


}