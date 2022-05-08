const ValAPI = require('unofficial-valorant-api')
const { MessageEmbed, ReactionUserManager, Interaction, Client } = require('discord.js');

const playerEmbed = new MessageEmbed()
playerEmbed.setColor('DARK_RED')

const leaderboardEmbed = new MessageEmbed()
leaderboardEmbed.setColor('DARK_RED')

module.exports = {
    name: 'leaderboard',
    description: "Lists the leaderboard.",
    execute(message, args) {
        if(!args[0]) return;
        async function getLeaderboard(region, pageNumber) {
            const leaderboard = await ValAPI.getLeaderboard(region)
            const leaderboardPretty = leaderboard.data.map(x => `${x.leaderboardRank}. ${x.gameName}#${x.tagLine} - ${x.rankedRating} RR`);
            var page = 1;

            if(pageNumber != null){
                page = pageNumber
            }

            var maxPages = Math.ceil(leaderboardPretty.length/25);
            leaderboardEmbed
                .setTitle(`${page}/${maxPages} pages`)
                .setDescription(leaderboardPretty.slice((page-1)*25, (page*25)).join('\n'))
                
            message.channel.send({ embeds: [leaderboardEmbed] }).then((msg) => {
                msg.react('⬅️');
                msg.react('➡️');

                const filter = (reaction, user) => {
                    if(user.id != msg.author.id){
                        if(reaction.emoji.name === '➡️'){
                            page += 1
                            if(page > maxPages){
                                page = 1
                            }
                        } else if(reaction.emoji.name === '⬅️'){
                            page -= 1
                            if(page < 1){
                                page = maxPages
                            }
                            }
                        leaderboardEmbed
                            .setTitle(`${page}/${maxPages} pages`)
                            .setDescription(leaderboardPretty.slice((page-1)*25, (page*25)).join('\n'))

                        msg.edit({embeds: [leaderboardEmbed]})
                    }
                    return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id != msg.author.id;
                };
    
                msg.awaitReactions({ filter, max: Infinity, time: 120000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected
                    })
                    .catch(collected => {});
            });
        }
        var region = args[0].toLowerCase()
        if(region == "na" || region == "eu" || region == "ap" || region == "kr"){
            if(!args[1]){
                getLeaderboard(args[0], null)
            } else if(args[1] > 0){
                getLeaderboard(args[0], Math.round(args[1]))
            } else if(args[1] == 0){
                message.reply("Page number must be greater than 0!")
            } else {
                message.reply("Invalid syntax!")
            }
        } else {
            message.reply("Invalid syntax!")
        }
    }
}