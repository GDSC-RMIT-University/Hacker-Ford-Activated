const {Client, Intents} = require('discord.js');
const {guildId, token} = require('./config.json');
const Discord = require('discord.js');

// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, 'GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES',
        'DIRECT_MESSAGES', Intents.FLAGS.GUILD_MESSAGES]
});

var role = ''

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

// The bot going a bit nuts whenever someone says a specific word
client.on('message', message => {

    if (message.author.bot) return;

    var guild = client.guilds.cache.get(guildId);
    role = guild.roles.cache.find(r => r.name === "@everyone");

    if(message.content.includes('hi')){
        message.channel.send('\'sup.');
    } else if (message.content.includes('hello')){
        message.channel.send('How you doin\'?');
    } else if ( message.mentions.has(client.user)){
        message.channel.send('How can I help?!');
    }
});


// Login to Discord with your client's token
client.login(token);