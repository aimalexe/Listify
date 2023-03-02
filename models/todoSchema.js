const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const todo = new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
            name:{
                type: String,
                required: true,
                minLength: 3,
                maxLength: 50,
            }
        }),
        required: true
    },
    todo: {
        title: {
            type: String,
            minLength: 3,
            maxLength: 50,
            trim: true,
            required: true
        },
        description: {
            type: String,
            minLength: 3,
            maxLength: 1000,
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
    }
});

function validateTodo(todo){
    const isValid = Joi.object({
        userId: Joi
            .objectId()
            .required(),
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

const Todo = mongoose.model("Todo", todo);

module.exports.Todo = Todo;
module.exports.validate = validateTodo;