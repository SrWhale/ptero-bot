const { PterodactylPanel } = require('./src/index.js');

const client = new PterodactylPanel();

const dotenv = require('dotenv');
dotenv.config();

client.login().then(() => {

    client.loadCommands('./src/commands');

    client.loadListeners('./src/events');

    client.connectDatabase();
})