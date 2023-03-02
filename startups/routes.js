const user = require('../routes/userRoute');
const todo = require('../routes/todosRoute');
const auth = require('../routes/authRoute');
const error = require('../middlewares/error_middleware');

const express = require('express');
const winston = require('winston/lib/winston/config');
const router = express.Router();

module.exports = function(app){
    // Middleware function
    function logger(req, res, next) {
        winston.info(`${req.method} request for ${req.url}`);
        next();
    }
    router.use(logger); //? logs the HTTP method and URL of incoming requests to the server.
    app.use(express.json());    //? Middleware to parse JSON-encoded request bodies
    
    app.use("/api/user", user); //? Signup endpoint for a new user.
    app.use("/api/auth", auth); //? Login endpoint for existing user.
    app.use("/api/todos", todo);    //? Todos endpoint for a specified user.
    app.use(error); //? Handling Errors of Server.

}