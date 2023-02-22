const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },

    email:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },

    password:{
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255,
    }
});

userSchema.methods.generateAuthToken= function(){
    return jwt.sign({_id: this._id},
        config.get('jwtPrivateKey'));
}
const User = new mongoose.model("User", userSchema);

function validateUser(user){
    const isValidUser = Joi.object({
        name: Joi
            .string()
            .min(3)
            .max(50)
            .required(),
        
        email: Joi
            .string()
            .email()
            .min(5)
            .max(255)
            .required(),

        password: Joi
            .string()
            .min(8)
            .max(255)
            .required()
    });
    return isValidUser.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;