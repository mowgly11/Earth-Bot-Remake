const mongoose = require('mongoose');
const config = require('../config.json');

module.exports = {
    init: () => {
        mongoose.connect(`${config.mongoDbUrl}`);
        
        mongoose.connection.on('connected', () => {
            console.log('[DATABASE] The bot is Connected to the Database');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('[DATABASE] The bot has disconnected from the Database');
        });

        mongoose.connection.on('err', (err: any) => {
            console.log('[DATABASE] an error just happens : ' + err);
        });
    }
}

export {}