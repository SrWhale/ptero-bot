const { Command } = require('../index');

const node = require('nodeactyl');

const Client = node.Client;

module.exports = class PainelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'painel',
            aliases: ['panel'],
            description: 'Abra o painel de início para ver seus servidores'
        })

        this.client = client;

    }


    async run() {

        const db = await this.client.database.ref(`Pterodactyl/usuários/${this.message.author.id}`).once('value');

        if (!db.val()) return this.reply(`${this.message.member}, você ainda não configurou as credenciais para utilizar o painel. Para configurar, utilize o comando \`${this.client.getPrefix(this.message.guild.id)}config \`. `);

        Client.login(db.val().url, db.val().api, async (logged, msg) => {

            if (!logged) return this.reply(`Não foi possível logar utilizando estas credenciais. Por favor, verifique se a API está correta e configure novamente.`);

            const servers = await Client.getAllServers();
            if (!servers) return this.reply(`${this.message.member}, você não possui nenhum servidor em sua conta.`);

            const emoji = ['❌', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
            let index = 0;

            const embed = new this.client.embed()
                .setAuthor("Reaja abaixo com o emoji corresponte ao seu servidor", this.client.user.displayAvatarURL())
                .setDescription(`${servers.map(server => `${emoji[++index]} - ${server.attributes.name} \`(${server.attributes.identifier})\` `)}`);


            const sendMessage = await this.send(embed);

            for (let i = 0; i < servers.length + 1; i++) {
                sendMessage.react(emoji[i]);
            }

            const collector = sendMessage.createReactionCollector((r, u) => emoji.includes(r.emoji.name) && u.id === this.message.author.id, { max: 1 });

            collector.on('collect', async (r, u) => {
                sendMessage.delete({ timeout: 1000 });

                if (r.emoji.name === '❌') {
                    return this.reply(`${this.message.member}, você cancelou a operação com sucesso.`);
                };

                const selected = servers[emoji.indexOf(r.emoji.name) - 1];

                const ramMemory = await Client.getRAMUsage(selected.attributes.identifier);
                const cpuUsage = await Client.getCPUUsage(selected.attributes.identifier);
                const diskUsage = await Client.getDiskUsage(selected.attributes.identifier);

                const infoEmbed = new this.client.embed()
                    .setAuthor("Pterodactyl Panel - Painel de gerenciamento", this.client.user.displayAvatarURL())
                    .setDescription(`Servidor selecionado: **${selected.attributes.name}** \`(${selected.attributes.identifier})\`
                    Uso de memória RAM: \`${ramMemory.current}/${ramMemory.limit}\`
                    Uso de CPU: \`${cpuUsage.current}/${cpuUsage.limit}\`
                    Uso de disco: \`${diskUsage.current}/${diskUsage.limit} MB\` `);

                const sendInformationEmbed = await this.send(infoEmbed);
                await sendInformationEmbed.react("◀️");
                await sendInformationEmbed.react("🛑");
                await sendInformationEmbed.react("🔁");
                await sendInformationEmbed.react("⏹️");

                const secondCollector = sendInformationEmbed.createReactionCollector((r, u) => ["◀️", '🛑', '🔁', '⏹️'].includes(r.emoji.name) && u.id === message.author.id);

                secondCollector.on('collect', async (r2, u2) => {
                    console.log('a')
                })
            })
        });
    }
}