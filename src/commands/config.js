const { Command } = require('../index');

const node = require('nodeactyl');

const Client = node.Client;

module.exports = class ConfigCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'config',
            aliases: ['init', 'configure', 'iniciar'],
        })

        this.client = client;
    }

    async run() {
        this.message.member.send(new this.client.embed()
            .setDescription(`${this.message.member}, por favor, insira a API da sua conta.`)
            .setImage('https://media.discordapp.net/attachments/705073047400480768/726460403252723783/unknown.png?width=1026&height=219')
            .setFooter("Insira 'cancelar' a qualquer momento para cancelar a operação."))
            .then(async msg => {
                this.reply(`${this.message.member}, verifique seu privado.`)

                const collector = msg.channel.createMessageCollector(m => m.author.id === this.message.author.id);

                collector.on('collect', async ({ content }) => {
                    console.log(content)
                    Client.login('https://painel.companyore.com.br/', content, (logged, msg) => {
                        if (msg) console.log('Erro ao conectar: ' + msg)

                        if (!logged) return this.reply(`Não foi possível logar utilizando estas credenciais. Por favor, insira a API correta.`);

                        this.client.database.ref(`Pterodactyl/usuários/${this.message.author.id}`).set({ url: 'https://painel.companyore.com.br/', api: content });

                        this.message.member.send(new this.client.embed()
                            .setDescription(`${this.message.member}, o painel foi configurado com sucesso.`))
                            .then()
                            .catch();
                    })
                })
            }).catch(err => {
                this.reply(`${this.message.member}, para utilizar este comando é necessário estar com as mensagens privadas habilitadas!`)
            })

    }
}