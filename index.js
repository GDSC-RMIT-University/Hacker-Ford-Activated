const Discord = require('discord.js');
const {Client, Intents} = require('discord.js');
const {guildId, token} = require('./config.json');

// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, 
        'GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES',
        'DIRECT_MESSAGES', 
        Intents.FLAGS.GUILD_MESSAGES]
});

var role = ''

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

// The bot going a bit nuts whenever someone says a specific word
client.on('messageCreate', message => {

    if (message.author.bot) return;

    var guild = client.guilds.cache.get(guildId);
    role = guild.roles.cache.find(r => r.name === "@everyone");

    if(message.content.includes('hi')){
        message.channel.send('\'sup. ');
    } else if (message.content.includes('hello')){
        message.channel.send('How you doin\'?');
    } else if ( message.mentions.has(client.user)){
        message.channel.send('How can I help?!');
    }
});

//Reminder Feature
const ROLE_DEV_CHANNEL_ID = "907410177463042118"
const CHECK_INTERVAL = 500
const sendReminder = (channel,message) => {
    if (channel.isText()) {
        channel.send(message)
            .then(console.log("Reminder Sent!"))
            .catch(console.error);
    }
}
client.once('ready', () => {
    setInterval(() => {
        var currDate = new Date();
        if (currDate.getHours() == "0"){
            client.channels.fetch(ROLE_DEV_CHANNEL_ID)
                .then(channel => sendReminder(channel,"Testing Reminder"))
                .catch(console.error);
        }
    }, CHECK_INTERVAL)
})

// Login to Discord with your client's token
client.login(token);