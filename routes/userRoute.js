const { User , validate } = require('../models/userSchema');
const isValidRequest = require('../middlewares/isValidRequest_middleware');

const router = require('express').Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/',[isValidRequest(validate)] ,async (req, res)=>{
    let user = await User.findOne({email: req.body.email}); //check if user is present
    if(user) return res.status(400).send("User already registered!");

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt =  await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();
    const token = user.generateAuthToken();

    res.status(200).header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
})

module.exports = router;