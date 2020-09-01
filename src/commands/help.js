const { Command } = require('../index.js');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: 'Veja os comandos do BOT',
            aliases: ['ajuda']
        })
    }

    async run() {
        const prefix = await this.client.getPrefix(this.message.guild.id);

        this.send(new this.client.embed()
            .setAuthor("Pterodactyl Panel - Ajuda", this.client.user.displayAvatarURL())
            .setDescription(`${this.client.commands.filter(command => !command.conf.isDev).map(command => ` \`${prefix}${command.help.name}\` - ${command.help.description} `).join("\n")}`)
            .setFooter(`Pterodactyl Panel - Ajuda`, this.client.user.displayAvatarURL()));

    }
}