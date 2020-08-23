const { MessageEmbed } = require('discord.js');

module.exports = class PteroEmbed extends MessageEmbed {
    constructor() {
        super()

        this.color = '#36393e'
    }
}