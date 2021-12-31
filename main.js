const Discord = require('discord.js');
const fs = require('fs');
const { msg } = require('./commands/leaderboard');
const client = new Discord.Client({intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
]});

//const config = require('./config.json')

let prefix = '+'

module.exports = { prefix }

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`${client.user.tag} is online!`)
})

client.on("messageCreate", message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    args = message.content.slice(prefix.length).split(/ +/);
    command = args.shift().toLowerCase();

    if(client.commands.get(command)){
        client.commands.get(command).execute(message, args)
    }
    
    if(command === "prefix"){
        if(!args[0]){
            message.reply(`The current prefix is ${prefix}`)
        } else {
            prefix = args[0]
            message.reply(`The prefix has been changed to ${prefix}`)
        }
    }
})


client.login(process.env.DJS_TOKEN);