const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

const connectDatabase = require('../../../startups/connectDatabase');

jest.mock('winston', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

describe('connectDatabase - Basic functionalit using unit testing', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset the winston logger before each test
    });

    it('should connect to the database with the correct connection string', async () => {
        mongoose.connect = jest.fn(() => Promise.resolve());

        await connectDatabase();

        // Check that mongoose.connect() was called with the correct connection string
        expect(mongoose.connect).toHaveBeenCalledWith(
            expect.stringContaining(config.get('database.databaseUserName')
        ));
        expect(mongoose.connect).toHaveBeenCalledWith(
            expect.stringContaining(config.get('database.password')
        ));
        expect(mongoose.connect).toHaveBeenCalledWith(
            expect.stringContaining(config.get('database.collectionName')
        ));
        expect(mongoose.connect).toHaveBeenCalledWith(
            expect.stringContaining(config.get('database.clusterName')
        ));
    });

    it('should log an error if there is an issue connecting to the database', async () => {
        const error = new Error('Failed to connect to database');
        mongoose.connect = jest.fn(() => Promise.reject(error));

        await connectDatabase();

        expect(winston.error).toHaveBeenCalledWith(error);
    });

    it('should log a message when successfully connected to the database', async () => {
        mongoose.connect = jest.fn(() => Promise.resolve());

        await connectDatabase();

        expect(winston.info).toHaveBeenCalledWith(
            expect.stringContaining('Connected in Mongodb Atlas to')
        );
        expect(winston.info).toHaveBeenCalledWith(
            expect.stringContaining(config.get('database.collectionName')
        ));
    });
});
