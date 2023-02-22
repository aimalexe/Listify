const { User } = require('../../../models/userSchema');

const request = require('supertest');

jest.setTimeout(70 * 1000);

describe('/api/auth', ()=>{
    let server;

    beforeEach(async ()=>{
        server = await require("../../../index");
    });

    afterEach(async ()=>{
        await User.deleteMany({});
        await server.close();
    });

}); // end of /api/auth