const { Todo } = require('../../../models/todoSchema');
const { User } = require('../../../models/userSchema'); 

const request = require("supertest");
const moment = require("moment");
const mongoose = require("mongoose");

jest.setTimeout(70 * 1000);

describe("/api/todos/", ()=>{
    let server,
        user, userId, userTodoId, token;
    const endPoint = '/api/todos/';

    beforeEach(async ()=>{
        server = await require("../../../index");

        userId = mongoose.Types.ObjectId();
        userTodoId = mongoose.Types.ObjectId()

        user = new User({
            _id: userId,
            name: "test user",
            email: "test@test.com",
            password: "12345678"
        });
        user.save();

        todo = new Todo({
            _id: userTodoId,
            user:{
                _id: userId,
                name: user.name 
            },
            todo: {
                title: "Title",
                description: "Some description of this todo",
                dueDate: moment().add(2, 'days').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
                priority: 3,
                tags: ["Tag 1", "tag 2", "Blah blah"]
            }
        });
        await todo.save();

        token = user.generateAuthToken();
    });

    afterEach(async ()=>{
        await Todo.deleteMany({});
        await User.deleteMany({});
        await server.close();
    });

    describe("GET /", ()=>{
        const happyPath = () => {
            return request(server)
                .get(endPoint)
                .set('x-auth-token', token)
                .send();
        }

        it("should return 404 if user is not found (have not yet signed up)", async()=>{
            userId = mongoose.Types.ObjectId();
            token = User({Id: userId}).generateAuthToken();
            const res = await happyPath();

            expect(res.status).toBe(404)
            expect(res.text).toMatch(/User is not registered/)
        });

        it("should return 404 if user have no todos yet", async ()=>{
            const newUser = new User({
                _id: mongoose.Types.ObjectId().toHexString(),
                name: "test2 user",
                email: "newUser@test.com",
                password: "12345678"
            });
            await newUser.save();
            token = newUser.generateAuthToken();

            const res = await happyPath();

            expect(res.status).toBe(404);
            expect(res.text).toMatch(/No todos yet!/);
        });

        it("should return status code 200 with sending array of todo's", async ()=>{
            const res = await happyPath();

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(1);
        });

        it("should contains the todo's ", async ()=>{
            // await user.save();
            // await todo.save();
            const res = await happyPath();

            expect(res.body.some(t => t._id == userTodoId)).toBeTruthy();
            expect(res.body.some(t => t.user._id == userId)).toBeTruthy();
            expect(res.body.some(t => t.user.name == todo.user.name)).toBeTruthy();
            expect(res.body.some(t => t.todo.title === todo.todo.title )).toBeTruthy();
            expect(res.body.some(t => moment(t.todo.dueDate).isSame(todo.todo.dueDate))).toBeTruthy();
        });
    }); //end of GET

    describe("POST /", ()=>{
        let title, description, dueDate, priority, tags;

        beforeEach(()=>{
            //Required
            title = 'Todo Title';
            dueDate = moment().add(2, 'days').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'; //two days later
            //Not required
            description = 'This is a little bit description of this todo';
            priority = 4;
            tags = ['A todo', 'test', 'code'];
        });

        const happyPath = () => {
            return request(server)
                .post(endPoint)
                .set('x-auth-token', token)
                .send({
                    userId, title, description, dueDate, priority, tags
                });
        }

        it('should return 400 if title is not present or valid', async()=>{
            title = ''
            const res = await happyPath();

            expect(res.statusCode).toBe(400);
            expect(res.text).toMatch(/\"title\" is not allowed to be empty/);

        });

        it('should return 400 if userId is not present or valid', async()=>{
            userId = ''
            const res = await happyPath();

            expect(res.statusCode).toBe(400);
            expect(res.text).toMatch(/\"userId\" is not allowed to be empty/);

        });

        it('should return 400 if dueDate is not present or valid', async()=>{
            dueDate = ''
            const res = await happyPath();

            expect(res.statusCode).toBe(400);
            expect(res.text).toMatch(/\"dueDate\" must be a valid date/);

        });
        
        it("should return 404 if user is not found (have not yet signed up)", async()=>{
            await User.findByIdAndDelete(userId);

            const res = await happyPath();

            expect(res.status).toBe(404)
            expect(res.text).toMatch(/User is not registered/)
        });

        it("should send 200 on saving a new todo", async ()=>{
            const res = await happyPath();

            expect(res.statusCode).toBe(200);
        });

        it('should send the saved todo', async ()=>{
            const res = await happyPath();
            
            expect(res.body).toMatchObject({
                user:{
                    _id: userId.toString(),
                    name: user.name
                },
                todo:{
                    title: title,
                    description: description,
                    dueDate: dueDate,
                    priority: priority, 
                    tags: tags
                }
            });
        });
    }); //end of POST
    
    describe("PUT /:id", ()=>{
        let title, description, isCompleted,
            dueDate, priority, tags;

        beforeEach(()=>{
            //Required
            title = 'Updated Todo Title';
            dueDate = moment().add(2, 'days').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'; //two days later
            //Not required
            description = 'This is a little Changed and Updated bit description of this todo';
            priority = 4;
            tags = ['A todo', 'test', 'code', 'updated'];
            isCompleted = true;
        });

        const happyPath = () =>{
            return request(server)
                .put(endPoint + userTodoId)
                .set('x-auth-token', token)
                .send({
                    userId, title, description, dueDate, priority,
                    tags, isCompleted
                });
        }
        it('should return 400 if title is not present or valid', async()=>{
            title = ''
            const res = await happyPath();

            expect(res.statusCode).toBe(400);
            expect(res.text).toMatch(/\"title\" is not allowed to be empty/);

        });

        it('should return 400 if userId is not present or valid', async()=>{
            userId = ''
            const res = await happyPath();

            expect(res.statusCode).toBe(400);
            expect(res.text).toMatch(/\"userId\" is not allowed to be empty/);

        });

        it('should return 400 if dueDate is not present or valid', async()=>{
            dueDate = ''
            const res = await happyPath();

            expect(res.statusCode).toBe(400);
            expect(res.text).toMatch(/\"dueDate\" must be a valid date/);

        });
        
        it("should return 404 if invalid user's todo id is provided", async()=>{
            userTodoId = '12345'
            const res = await happyPath();
            
            expect(res.status).toBe(404);
            expect(res.text).toMatch(/the requested todo ID is invalid./);
        });
        
        it("should return 404 if no todo is found with given id", async()=>{
            userTodoId = mongoose.Types.ObjectId();
            const res = await happyPath();
            
            expect(res.status).toBe(404);
            expect(res.text).toMatch(`Todo with ID:${userTodoId} is't found!`);
        });
        
        it("should return 404 if user is not found (have not yet signed up)", async()=>{
            await User.findByIdAndDelete(userId);

            const res = await happyPath();

            expect(res.status).toBe(404);
            expect(res.text).toMatch(/User is not registered/);
        });
        
        it("should return 200 when todo is updated successfully", async()=>{
            const res = await happyPath();

            expect(res.status).toBe(200);
        });

        it("should send the seted / updated todo", async()=>{
            const res = await happyPath();

            expect(res.body).toMatchObject({
                user:{
                    _id: userId.toString(),
                    name: user.name
                },
                todo:{
                    title: title,
                    description: description,
                    dueDate: dueDate,
                    priority: priority, 
                    tags: tags
                },
                _id: userTodoId.toString()
            });
        });
    });//end of PUT /api/todos/:id

    describe("DELETE /:id", ()=>{
        const happyPath = () =>{
            return request(server)
                .delete(endPoint + userTodoId)
                .set('x-auth-token', token)
                .send();
        }

        it("should return 404 if invalid user's todo id is provided", async()=>{
            userTodoId = '12345'
            const res = await happyPath();
            
            expect(res.status).toBe(404);
            expect(res.text).toMatch(/the requested todo ID is invalid./);
        });

        it("should return 404 if no todo is found with given id", async()=>{
            userTodoId = mongoose.Types.ObjectId();
            const res = await happyPath();
            
            expect(res.status).toBe(404);
            expect(res.text).toMatch(`Todo with ID:${userTodoId} is't found!`);
        });
        
        it("should return 200 when todo is Deleted successfully from Database", async()=>{
            const res = await happyPath();
            const todoInDb = await Todo.findById(userTodoId);

            expect(res.status).toBe(200);
            expect(res.text).toMatch(/Deleted Successfully!/);
            expect(todoInDb).toBeNull();
        });
    });//end of DELETE /api/todos/:id

}); //end of /api/todos