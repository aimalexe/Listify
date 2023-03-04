const { User } = require('../../../models/userSchema');

const request = require('supertest');

jest.setTimeout(70 * 1000);

describe('POST /api/auth', ()=>{
    let server;
    let email, password, user;

    beforeEach(async ()=>{
        server = await require("../../../index");

        email = 'test@email.com';
        password = 'password12345';
        
        user = new User({email, password, name: "Test User" });
        await user.save();
    });

    afterEach(async ()=>{
        await User.deleteMany({});
        await server.close();
    });

    const happyPath = () => {
        return request(server)
            .post('/api/auth/')
            .send({ email, password });
    }

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

    it('should return 400 if not a registered user', async ()=>{
        email = 'notRegisterde@email.com'
        const res = await happyPath();

        expect(res.statusCode).toBe(400);
        expect(res.text).toMatch(/Invalid email or password!/);
    });

    it('should return 400 if a wrong password is sent', async ()=>{
        password = 'wrongPassword'
        const res = await happyPath();

        expect(res.statusCode).toBe(400);
        expect(res.text).toMatch(/Invalid email or password!/);
    });

    it('should set x-auth-token in headers of valid user', async ()=>{
        await user.save();
        const res = await happyPath();

        expect(res.header["x-auth-token"]).not.toBeNull();
    });

    it('should send status 200 and also name, email, _id but not password ', async ()=>{
        const res = await happyPath();
    
    //! Not passing tests.
        expect(res.statusCode).toBe(200);
        expect(res.header['x-auth-token']).toBeDefined();
        expect(res.body._id).toBe(user._id.toHexString());
        expect(res.body.name).toBe(user.name);
        expect(res.body.email).toBe(email);
        expect(res.body.password).toBeUndefined();

    });
    

}); // end of /api/auth