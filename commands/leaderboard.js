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
        async function getLeaderboard(region, name, tag, pageNumber) {
            const leaderboard = await ValAPI.getLeaderboard(region)
            const leaderboardPlayers = leaderboard.data.players
            const leaderboardPretty = leaderboard.data.players.map(x => `${x.leaderboardRank}. ${x.gameName}#${x.tagLine} - ${x.rankedRating} RR`);
            const player = leaderboardPlayers.find(obj => obj.gameName.toLowerCase() === name && obj.tagLine.toLowerCase() === tag);
            if(!player){
                message.reply("Player does not exist or is not in leaderboard!")
            } else if(name != null && tag != null){
                playerEmbed
                    .setTitle(`#${player.leaderboardRank}. ${player.gameName}#${player.tagLine}`)
                    .setDescription(`${player.numberOfWins} Wins - ${player.rankedRating} RR`);

                message.reply({embeds: [playerEmbed]});
            } else {
                var page = 1;

                if(pageNumber != null){
                    page = pageNumber
                }

                var maxPages = Math.ceil(leaderboardPlayers.length/25);
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
                            console.log("asdasd")
                        })
                        .catch(collected => {});
                });
            }
        }
        if(args[0].toLowerCase() == "na" || args[0].toLowerCase() == "eu" || args[0].toLowerCase() == "ap" || args[0].toLowerCase() == "kr"){
            if(!args[1]){
                getLeaderboard(args[0], null, null, null)
            } else if(args.join().includes("#")) {
                username = message.content.substring(14+args[0].length).split("#");
                getLeaderboard(args[0], username[0].toLowerCase(), username[1].toLowerCase(), null);
            } else if(args[1] > 0){
                getLeaderboard(args[0], null, null, Math.round(args[1]))
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