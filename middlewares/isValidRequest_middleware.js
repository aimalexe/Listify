//To get rid of these repetitive codes, validate requests of user
//by using this middleware.

module.exports = (validate) => {
    return (req, res, next) => {
        const { error } = validate(req.body);   //validate request
        if(error) return res.status(400).send(error.details[0].message);
        next();
    }
}