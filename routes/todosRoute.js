const { Todo, validate } = require('../models/todoSchema');
const _ = require('lodash');
const router = require('express').Router();

router.get("/", async (req, res)=>{
    const todos = await Todo.find().sort("-dueDate");
    res.status(200).send(todos);
})

router.post("/", async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const todo = new Todo(_.pick(req.body, ["title", "description", "isCompleted", "issueDate", "dueDate", "priority", "tags"]));
    await todo.save()
    res.status(200).send(todo);
});

module.exports = router;