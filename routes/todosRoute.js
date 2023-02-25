const { Todo, validate } = require('../models/todoSchema');
const { User } = require('../models/userSchema');
const isValidRequest = require('../middlewares/isValidRequest_middleware');
const isAuthenticated = require('../middlewares/isAuthenticated_middleware')

const _ = require('lodash');
const router = require('express').Router();

router.get("/", isAuthenticated, async (req, res)=>{
    const userId  = req.user._id;

    const user = await User.findById(userId).select('-password');
    if(!user) return res.status(404).send("User is not registered");

    const todos = await Todo.find({"user._id": userId}).sort("-dueDate");
    if(!todos) return res.status(404).send("No todos yet!");
    res.status(200).send(todos);
});

router.post("/", [isValidRequest(validate), isAuthenticated], async (req, res)=>{
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if(!user) return res.status(404).send("User is not registered");

    let todo = new Todo({
        user: {
            _id: user._id,
            name: user.name
        },
        todo:
            _.pick(req.body, [
                "title", "description", "isCompleted", "issueDate",
                "dueDate", "priority", "tags"
            ])
    });
    await todo.save();

    res.status(200).send(todo);
});

module.exports = router;