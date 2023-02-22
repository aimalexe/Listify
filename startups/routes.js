const user = require('../routes/userRoute');
const todo = require('../routes/todosRoute');
const auth = require('../routes/authRoute');

const express = require('express');
const router = express.Router();

module.exports = function(app){
    // Middleware function
    function logger(req, res, next) {
        console.log(`${req.method} request for ${req.url}`);
        next();
    }
    router.use(logger);
    app.use(express.json());
    
    app.use("/api/user", user);
    app.use("/api/auth", auth);
    app.use("/api/todos", todo);
}