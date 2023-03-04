const request = require('supertest');
const { Todo } = require('../../../models/todoSchema');
const { User } = require('../../../models/userSchema');

jest.setTimeout(50 * 1000);

describe("isAuthenticated_middleware  - Basic Functionality", ()=>{
    let server, token;
    
    beforeEach(()=>{ 
        server = require('../../../index');

        token = new User().generateAuthToken();
    });
    
    const happyPath = () => {
        return request(server)
            .get("/api/todos/")
            .set("x-auth-token", token)
            .send();
    }

    afterEach(async ()=>{
        await Todo.deleteMany({});
        server.close();
    });

    it("should return 401 if user is not loged in (have no token)", async()=>{
        token = '';
        const res = await happyPath();

        expect(res.status).toBe(401);
        expect(res.text).toMatch(/Access denied. No token provided./)
    });

    it("should return 400 if invalid token is provided", async()=>{
        token = 'invalidToken1234';
        const res = await happyPath();
        
        expect(res.status).toBe(400);
        expect(res.text).toMatch(/Invalid token./);
    });
        
    //  for testing payload we shall write unit test because supertest has
    //  no access to request object.
});