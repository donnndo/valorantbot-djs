const { MessageEmbed } = require('discord.js');

const createEmbed = new MessageEmbed()
createEmbed.setColor('DARK_RED')

module.exports = {
    name: 'help',
    description: "Displays help information.",
    execute(message, args) {
        createEmbed
            .setTitle("Commands")
            .setDescription("Ping the bot | +ping\nLookup basic account info | +lookup name#tag\nCheck the current leaderboard or your leaderboard position | +leaderboard <region> <name (optional)> | +leaderboard <region> <page (optional)>")

        message.channel.send({embeds: [createEmbed]})
    }
}