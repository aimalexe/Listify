const { Todo, validate } = require('../models/todoSchema');
const isValidRequest = require('../middlewares/isValidRequest_middleware');

const _ = require('lodash');
const router = require('express').Router();

router.get("/", async (req, res)=>{
    const todos = await Todo.find().sort("-dueDate");
    res.status(200).send(todos);
})

router.post("/", isValidRequest(validate), async (req, res)=>{
    const todo = new Todo(_.pick(req.body, ["title", "description", "isCompleted", "issueDate", "dueDate", "priority", "tags"]));
    await todo.save()
    res.status(200).send(todo);
});

module.exports = router;