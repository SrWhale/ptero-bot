const { PterodactylPanel } = require('./src/index.js');

const client = new PterodactylPanel({
    fetchAllMembers: true,
    presence: {
        Activity: 'convite.pterodactylbot.tk',
        type: 'PLAYING'
    }
});

const dotenv = require('dotenv');
dotenv.config();

client.login().then(() => {

    client.loadCommands('./src/commands');

    client.loadListeners('./src/events');

    client.connectDatabase();
})
