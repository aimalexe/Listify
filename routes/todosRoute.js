const { Todo, validate } = require('../models/todoSchema');
const { User } = require('../models/userSchema');
const isValidRequest = require('../middlewares/isValidRequest_middleware');
const isAuthenticated = require('../middlewares/isAuthenticated_middleware');
const isValidId = require('../middlewares/isValidObjectId_middleware');

const _ = require('lodash');
const todoRouter = require('express').Router();

todoRouter.get("/", isAuthenticated, async (req, res)=>{
    const userId  = req.user._id;

    const user = await User.findById(userId).select('-password');
    if(!user) return res.status(404).send("User is not registered");

    const todos = await Todo.find({"user._id": userId}).sort("-dueDate");
    if(!todos) return res.status(404).send("No todos yet!");
    
    res.status(200).send(todos);
});

todoRouter.post("/", [isValidRequest(validate), isAuthenticated], async (req, res)=>{
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

todoRouter.put("/:id",[isValidRequest(validate), isAuthenticated, isValidId], async (req, res)=>{
    let todo = await Todo.findById(req.params.id);
    if(!todo) return res.status(404).send(`Todo with ID:${req.params.id} is't found!`);

    const user = await User.findById(todo.user._id);
    if(!user) return res.status(404).send("User is not registered");

    todo.set({
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

todoRouter.delete("/:id", [isValidId, isAuthenticated], async(req, res)=>{
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if(!todo) return res.status(404).send(`Todo with ID:${req.params.id} is't found!`)
    
    res.status(200).send(`Deleted Successfully!`);
});

module.exports = todoRouter;