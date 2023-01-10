const mongoose = require('mongoose');
const Joi = require('joi');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 50,
        trim: true,
        required: true
    },
    description: {
        type: String,
        minlength: 3,
        maxlength: 1000,
        required: false,
    },
    isCompleted: {
        type: Boolean,
        required: false,
        default: false
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true,
    },
    priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    tags: {
        type: [String],
        required: false
    }
});

function validateTodo(todo){
    const isValid = Joi.object({
        title: Joi
            .string()
            .min(3)
            .max(50)
            .trim()
            .required(),
        description: Joi
            .string()
            .min(3)
            .max(1000),
        isCompleted: Joi
            .boolean()
            .default(false),
        issueDate: Joi
            .date()
            .default(Date.now),
        dueDate: Joi
            .date()
            .required(),
        priority: Joi
            .number()
            .min(1)
            .max(5)
            .default(1),
        tags: Joi
            .array()
    });
    return isValid.validate(todo);
}

const Todo = mongoose.model("Todo", todoSchema);
module.exports.Todo = Todo;
module.exports.validate = validateTodo;