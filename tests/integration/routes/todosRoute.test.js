const request = require("supertest");
const moment = require("moment");
const mongoose = require("mongoose");
const { Todo } = require('../../../models/todoSchema');

jest.setTimeout(70 * 1000);

describe("/api/todos", ()=>{
    let server;

    beforeEach(async ()=>{
        server = await require("../../../index");
    });

    afterEach(async ()=>{
        await Todo.deleteMany({});
        await server.close();
    });

    describe("GET /", ()=>{
        let todo;
        let todoId;

        beforeEach(async ()=>{
            todoId = mongoose.Types.ObjectId();
            todo = new Todo({
                _id: todoId,
                title: "Title",
                description: "Some description of this todo",
                dueDate: "2023-01-10T11:01:58.135Z",
                priority: 5,
                tags: []
            });
            await todo.save();
        });
        const happyPath = () => {
            return request(server)
                .get('/api/todos/')
                .send();
        }

        it("should return status code 200", async ()=>{
            const res = await happyPath();

            expect(res.statusCode).toBe(200);
        });

        it("should return array of all the todo's", async ()=>{
            const res = await happyPath();

            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(1);
        });

        it("should contains the todo's ", async ()=>{
            const res = await happyPath();

            expect(res.body.some(t => t.title === todo.title )).toBeTruthy();
            expect(res.body.some(t => t._id == todoId)).toBeTruthy();
            expect(res.body.some(t => moment(t.dueDate).isSame(todo.dueDate))).toBeTruthy();
        });
    }); //end of GET

    describe("POST /", ()=>{
        const happyPath = () => {
            return request(server)
                .post('/api/todos/')
                .send();
        }

        it("should send 200 on saving a new todo", async ()=>{
            const res = await happyPath();
            expect(res.statusCode).toBe(200);
        });

    }); //end of POST
    
}); //end of /api/todos