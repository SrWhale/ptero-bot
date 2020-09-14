const { getServerStatus } = require('nodeactyl/client');
const { Command } = require('../index');

const { Client } = require('../index');

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

        if (!db.val()) return this.reply(`${this.message.member}, você ainda não configurou as credenciais para utilizar o painel. Para configurar, utilize o comando \`${await this.client.getPrefix(this.message.guild.id)}config \`. `);

        const connection = await this.reply(`<a:carregando:753622965123285002> Estabelecendo conexão com o painel...`);

        const ptero = new Client(db.val().url, db.val().api);

        ptero.login().then(async (status) => {

            if (status.error && !status.status) {
                this.reply(`❌ Não foi possível estabelecer a conexão com o painel informado.`);
                connection.delete({ timeout: 2000 })
                return;
            }

            if (!status.status) return this.reply(`Não foi possível logar utilizando estas credenciais. Por favor, verifique se a API está correta e configure novamente.`);
            if (status.status) connection.delete({ timeout: 2000 });

            const servers = await ptero.getAllServers();

            if (!servers.length && !servers) return this.reply(`${this.message.member}, você não possui nenhum servidor em sua conta.`);

            const emoji = ['❌', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
            let index = 0;

            const embed = new this.client.embed()
                .setAuthor("Reaja abaixo com o emoji corresponte ao seu servidor", this.client.user.displayAvatarURL())
                .setDescription(`${servers.map(server => `${emoji[++index]} - ${server.attributes.name} \`(${server.attributes.identifier})\` `).join('\n')}`);


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
                const serverStatus = await ptero.request('GetServerInfo', selected.attributes.identifier);

                const emojisMessage = ['Online', 'Desligando', 'Reiniciando', 'Iniciando'].includes(serverStatus.status)
                    ? ['Reiniciando', 'Desligando'].includes(serverStatus.status)
                        ? serverStatus.status === 'Desligando'
                            ? { message: '🛑 - Matar servidor', emojis: ['🛑'] }
                            : { message: '⏹️ - Parar servidor \n🛑 - Matar servidor', emojis: ['⏹️', '🛑'] }
                        : { message: '🔁 - Reiniciar servidor; \n⏹️ - Parar servidor; \n🛑 - Matar servidor.', emojis: ['🔁', '⏹️', '🛑'] }
                    : { message: `◀️ - Iniciar servidor`, emojis: ['◀️'] };

                const allowedEmojis = ['Online', 'Desligando', 'Reiniciando', 'Iniciando'].includes(serverStatus.status)
                    ? ['Reiniciando', 'Desligando'].includes(serverStatus.status)
                        ? serverStatus.status === 'Desligando'
                            ? ['🛑']
                            : ['⏹️', '🛑']
                        : ['🔁', '⏹️', '🛑']
                    : ['◀️'];

                const infoEmbed = new this.client.embed()
                    .setAuthor("Pterodactyl Panel - Painel de gerenciamento", this.client.user.displayAvatarURL())
                    .setDescription(`Servidor selecionado: ** ${selected.attributes.name}** \`(${selected.attributes.identifier})\`

                    Status: \`${serverStatus.status}\`    
                    Uso de memória RAM: \`${serverStatus.usageMemory}/${serverStatus.maxMemory} MB\`
                    Uso de CPU: \`${serverStatus.cpuUsage}%\`
                    Uso de disco: \`${serverStatus.diskUsage}/${serverStatus.maxDisk} MB\`

                    ${emojisMessage.message}`);

                const sendInformationEmbed = await this.send(infoEmbed);

                for (let i = 0; i < allowedEmojis.length; i++) sendInformationEmbed.react(allowedEmojis[i]);

                const secondCollector = sendInformationEmbed.createReactionCollector((r, u) => emojisMessage.emojis.includes(r.emoji.name) && u.id === this.message.author.id);

                secondCollector.on('collect', async (r2, u2) => {
                    switch (r2.emoji.name) {
                        case '◀️':
                            const start = await ptero.postRequest('start', selected.attributes.identifier);
                            if (start === "Servidor iniciado com sucesso.") this.reply(start);
                            break;

                        case '🛑':
                            const kill = await ptero.postRequest('kill', selected.attributes.identifier);
                            if (kill === "Servidor morto com sucesso.") this.reply(kill);
                            break;

                        case '⏹️':
                            const stop = await ptero.postRequest('stop', selected.attributes.identifier);
                            if (stop === "Servidor desligado com sucesso.") this.reply(stop);
                            break;

                        case '🔁':
                            const reiniciar = await ptero.postRequest('restart', selected.attributes.identifier);
                            if (reiniciar === 'Servidor reiniciado com sucesso.') this.reply(reiniciar);
                            break;
                    }
                })
            })
        })
    }
}