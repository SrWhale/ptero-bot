const { Command } = require('../index');
const { inspect } = require('util');
module.exports = class EvalCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            isDev: true,
            aliases: ['ev'],
            description: 'Descrição não definida'
        })
    }

    async run() {
        if (!["375356261211963392"].includes(this.message.author.id)) return;

        let code = this.args.slice(0).join(" ");

        code = code.replace(/^`{3}(js)?|`{3}$/g, '')
        code = code.replace(/<@!?(\d{16,18})>/g, 'user($1)')

        if (!code) return this.reply("Você se esqueceu de inserir o código.")

        let result;

        try {
            const evaled = await eval(code);

            result = inspect(evaled, { depth: 0 });
        } catch (error) {
            result = error.toString();
        };

        result = result.replace(/_user\((\d{16,18})\)/g, '<@$1>');

        this.message.channel.send(result, { code: 'js' });
    }
}