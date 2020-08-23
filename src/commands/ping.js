const { Command } = require('../index');

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Veja o PING do bot',
            aliases: []
        })

        this.client = client;

    }

    run() {
        this.reply(`Pong! Estou atualmente com \`${this.client.ws.ping} ms!\` `);
    }
}