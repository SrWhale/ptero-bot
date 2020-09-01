const { Command } = require('../index');

module.exports = class prefixCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prefix',
            description: 'Altere o prefixo do BOT no servidor',
            permissions: ['MANAGE_GUILD']
        })
    }

    async run() {
        if (!args[0]) return this.reply(`${this.message.member}, você deve inserir o novo prefixo!`);
        this.client.database.ref(`Pterodactyl/servidores/${message.guild.id}/config/prefix`).set(args[0]);

        this.reply(`${this.message.member}, o prefixo foi alterado com sucesso.`)
    }
}