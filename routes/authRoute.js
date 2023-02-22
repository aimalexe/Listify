const { User } = require('../models/userSchema');
const isValidRequest = require('../middlewares/isValidRequest_middleware');

const router = require('express').Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');

router.post('/', isValidRequest(validate), async(req, res)=>{
    //TODO test auth route and middleWare.
    
    let user = new User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Invalid email or password!");

    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if(!validatePassword) return res.status(400).send("Invalid email or password!");

    const token = user.generateAuthToken();
    res.status(200).header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

function validate(req) {
    const validateReq = Joi.object({
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
    return validateReq.validate(req);        
};
module.exports = router;