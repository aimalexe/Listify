const mongoose = require('mongoose');
const isAuthenticate = require('../../../middlewares/isAuthenticated_middleware');
const { User } = require('../../../models/userSchema');

describe("isAuthenticate", ()=>{
    it("Should populate req.user with the payload of valid JWT",()=>{
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
        }
        const token = new User(user).generateAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res = {}
        const next = jest.fn();

        isAuthenticate(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});