const ValAPI = require('unofficial-valorant-api')
const { MessageEmbed } = require('discord.js');

const createEmbed = new MessageEmbed()
createEmbed.setColor('DARK_RED')

module.exports = {
    name: 'lookup',
    description: "Displays account information.",
    execute(message, args) {
        accountName = message.content.substring(8)
        async function sendAccount(name, tag) {
            const account = await ValAPI.getAccount(name, tag);
            const accountMMR = await ValAPI.getMMR('v2', account.data.region, name, tag);
            createEmbed
                .setTitle(`${account.data.name}#${account.data.tag}`)
                .setThumbnail(account.data.card.small)
                .setFields(
                    {name: 'Region', value: account.data.region.toUpperCase()},
                    {name: 'Level', value: `${account.data.account_level}`},
                    {name: 'Rank', value: `${accountMMR.data.current_data.currenttierpatched} - ${accountMMR.data.current_data.ranking_in_tier} RR`},
                    {name: 'Wins', value: `${accountMMR.data.by_season[Object.keys(accountMMR.data.by_season)[0]].wins}`}
                );
            message.reply({embeds: [createEmbed] });
        }

        accountName = accountName.split("#");
        sendAccount(accountName[0], accountName[1]);
    }
}