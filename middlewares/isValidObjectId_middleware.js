const mongoose = require('mongoose');

//To check if a valid id is sent in params
module.exports = function(req, res, next){
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('the requested todo ID is invalid.');

    next();
}