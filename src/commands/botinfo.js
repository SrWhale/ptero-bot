const { Command } = require('../index');

module.exports = class BotinfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'botinfo',
            description: 'Veja algumas iformações do BOT'
        })
    }

    async run() {

        const moment = require("moment");
        require("moment-duration-format");
        const duration = moment.duration(this.client.uptime).format(" D [dias], H [horas], m [minutos], s [segundos]");

        this.send(new this.client.embed()
            .setAuthor("Pterodactyl Panel - BOTINFO", this.client.user.displayAvatarURL())
            .setDescription(`${this.message.author}, veja algumas de minhas informações.`)
            .addField("Meu criador", `SrWhale#0001`, true)
            .addField("Me convite para seu servidor", `[Clique aqui](https://discord.com/oauth2/authorize?client_id=726449587430096947&permissions=354368&scope=bot).`, true)
            .addField("Acesse minha Source:", `[Clique aqui](https://github.com/SrWhale/Pterodactyl-Panel)`, true)
            .addField("Estou em...", `${this.client.guilds.cache.size} servidores, com ${this.client.users.cache.size} usuários.`, true)
            .addField("Estou online há: ", duration.replace('minsutos', 'minutos'))
            .setFooter(`Solicitado por ${this.message.author.tag}`, this.message.author.displayAvatarURL()))
    }
}
