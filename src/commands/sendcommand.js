const { Command } = require('../index');

const { Client } = require('../index');
module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sendcommand',
            description: 'Envie um comando ao seu servidor.',
            aliases: ['enviarcomando', 'sendcmd', 'enviarcmd', 'comando']
        })

        this.client = client;

    }

    async run(prefix) {
        const db = await this.client.database.ref(`Pterodactyl/usuários/${this.message.author.id}`).once('value');

        if (!db.val()) return this.reply(`${this.message.member}, você ainda não configurou as credenciais para utilizar o painel. Para configurar, utilize o comando \`${await this.client.getPrefix(this.message.guild.id)}config \`. `);

        const connection = await this.reply(`<a:carregando:753622965123285002> Estabelecendo conexão com o painel...`);

        const ptero = new Client(db.val().url, db.val().api);

        ptero.login().then(async (status, err) => {
            if (status.error && !status.status) {
                this.reply(`❌ Não foi possível estabelecer a conexão com o painel informado.`);
                connection.delete({ timeout: 2000 })
                return;
            }

            if (!status.status) return this.reply(`Não foi possível logar utilizando estas credenciais. Por favor, verifique se a API está correta e configure novamente.`);
            if (status.status) connection.delete({ timeout: 2000 });

            const servers = await ptero.getAllServers();

            if (!servers.length && !servers) return this.reply(`${this.message.member}, você não possui nenhum servidor em sua conta.`);

            if (!this.args[0]) return this.reply(`Você se esqueceu de inserir o ID do servidor que deseja enviar o comando! (digite ${prefix}painel para saber o ID)`);
            if (!this.args[1]) return this.reply(`Você se esqueceu de inserir o comando que deseja enviar!`);

            const selected = servers.find(server => server.attributes.identifier === this.args[0]);

            if (!selected) return this.reply(`Não foi possível encontrar este servidor.`);

            const send = await ptero.sendCommand(selected.attributes.identifier, this.args.slice(1).join(" "));
            if (send === 'Comando enviado com sucesso.') this.reply(send);
        })
    }
}