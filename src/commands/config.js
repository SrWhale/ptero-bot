const { Command } = require('../index');

const { Client } = require('../index');

module.exports = class ConfigCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'config',
            aliases: ['init', 'configure', 'iniciar'],
            description: 'Configure suas credenciais para utilizar o painel'
        })

        this.client = client;
    }

    async run() {
        let index = 0;
        let url;
        let api;

        this.message.member.send(new this.client.embed()
            .setDescription(`${this.message.member}, por favor, insira a URL de seu painel. Exemplo: \`https://painel.suahospedagem.com\` `)
            .setFooter("Insira 'cancelar' a qualquer momento para cancelar a operação."))
            .then(async msg => {
                this.reply(`${this.message.member}, verifique seu privado.`);

                const collector = msg.channel.createMessageCollector(m => m.author.id === this.message.author.id);

                collector.on('collect', async ({ content }) => {
                    if (content.toLowerCase() === "cancelar") {
                        collector.stop();
                        this.message.member.send(new this.client.embed()
                            .setDescription(`Operação cancelada com sucesso.`));
                        return;
                    }
                    if (index === 0) {
                        url = content;
                        index++;
                        this.message.member.send(new this.client.embed()
                            .setDescription(`${this.message.member}, por favor, insira a API da sua conta.`)
                            .setImage('https://media.discordapp.net/attachments/705073047400480768/726460403252723783/unknown.png?width=1026&height=219')
                            .setFooter("Insira 'cancelar' a qualquer momento para cancelar a operação."))
                        return;

                    }

                    api = content;
                    collector.stop();

                    const ptero = new Client(url, api);

                    ptero.login(url, api).then(status => {

                        if (status.error) console.log('Erro ao conectar: ' + msg)

                        if (!status.status) return this.message.member.send(`Não foi possível logar utilizando estas credenciais. Por favor, utilize o comando novamente e insira a URL ou API correta.`);

                        this.client.database.ref(`Pterodactyl/usuários/${this.message.author.id}`).set({ url: url, api: content });

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