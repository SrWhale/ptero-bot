module.exports = class Command {
    constructor(client, options) {
        this.client = client;

        this.help = {
            name: options.name || null,
            description: options.description || "descriptions:default",
            aliases: options.aliases || [],
            category: options.category || null,
            usage: options.usage || options.name
        }

        this.conf = {
            permissions: options.permissions || [],
            isDev: options.isDev || false
        }

    }

    setMessage(message) {
        this.message = message;
        this.args = message.content.split(" ").slice(1);
    }

    reply(message) {
        return this.message.channel.send(new this.client.embed().setDescription(message));
    }

    send(message) {
        return this.message.channel.send(message);
    }

    verifyPermissions(message) {

        if (this.conf.isDev && !['375356261211963392'].includes(message.author.id)) {
            message.channel.send(this.client.embed.setDescription(`Por enquanto, este comando só está disponível para o desenvolvedor do BOT.`))
            return true;
        } else if (this.conf.permissions.length && !message.member.permissions.has(this.conf.permissions)) {
            message.channel.send(this.client.embed.setDescription(`Voce precisa da(s) permissião(oes) \`${this.permissions.join(', ')}\` para executar este comando.`))
            return true;
        }
    }
}