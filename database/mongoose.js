const config = require('../config.json');

module.exports = {
    initMongoose: (mongoose) => {
        mongoose.connect(`${config.mongoDbUrl}`);

        mongoose.connection.on('connected', () => {
            console.log('[DATABASE] The bot is Connected to the Database');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('[DATABASE] The bot has disconnected from the Database');
        });

        mongoose.connection.on('err', (err) => {
            console.log('[DATABASE] an error just happens : ' + err);
        });
    }
}