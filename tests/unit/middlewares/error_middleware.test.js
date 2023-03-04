const winston = require('winston');
const error_middleware = require('../../../middlewares/error_middleware');

describe('Error middleware - Basic functionality', () => {
    let server
    it('should log error with winston and send 500 response with message', async () => {
        server = require('../../../index');

        const error = new Error('Test error');
        const spy = jest.spyOn(winston, 'error');

        const mockReq = {};
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const mockNext = jest.fn();

        error_middleware(error, mockReq, mockRes, mockNext);

        expect(spy).toHaveBeenCalledWith(error.message, error);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith('Something went wrong with server');
        expect(mockNext).not.toHaveBeenCalled();

        await server.close();
    });
});

