const { User } = require('../../../models/userSchema');

const request = require('supertest');

jest.setTimeout(70 * 1000);

describe('/api/user', ()=>{
    let server;

    beforeEach(async ()=>{
        server = await require("../../../index");
    });

    afterEach(async ()=>{
        await User.deleteMany({});
        await server.close();
    });

    describe('POST /', ()=>{
        let name, email, password, user;

        beforeEach(()=>{
            name = "Name";
            email = "email@gmail.com";
            password = "password123456";

            user = new User({name, email, password});
        });

        const happyPath = () => {
            return request(server)
                .post('/api/user/')
                .send({
                    name, email, password
                });
        }

        it('should return 400 if name is invalid or not provided', async ()=>{
            name = '';
            const res = await happyPath();

            expect(res.statusCode).toBe(400);
            expect(res.text).toMatch(/\"name\" is not allowed to be empty/)
        });

        it('should return 400 if email is invalid or not provided', async ()=>{
            email = '';
            const res = await happyPath();

            expect(res.statusCode).toBe(400);
            expect(res.text).toMatch(/\"email\" is not allowed to be empty/)
        });

        it('should return 400 if password is invalid or not provided', async ()=>{
            password = '';
            const res = await happyPath();

            expect(res.statusCode).toBe(400);
            expect(res.text).toMatch(/\"password\" is not allowed to be empty/)
        });

        it('should return 400 if user is already registered', async ()=>{
            await user.save();
            const res = await happyPath();

            expect(res.statusCode).toBe(400);
        });

        it('should add salt and hash the password', async ()=>{
            const res = await happyPath();
            const userInDb = await User.findOne({email: email});

            expect(userInDb.password).not.toEqual(password);
            expect(res.body.password).toBeUndefined();
        });

        it('should set x-auth-token in headers', async ()=>{
            const res = await happyPath();

            expect(res.headers["x-auth-token"]).not.toBeNull();
        });

        it('should return 200 when a new user is saved', async ()=>{
            const res = await happyPath();

            expect(res.statusCode).toBe(200);
        });

        it('should return user object containing name, email, _id but not password', async ()=>{
            const res = await happyPath();

            expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
                '_id', 'name', 'email'
            ]));
            expect(res.body.password).toBeUndefined();
        });
    }); //  end of POST /

}); // end of /api/user