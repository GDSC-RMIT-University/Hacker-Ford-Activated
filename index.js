const {Client, Intents} = require('discord.js');
const {guildId, token} = require('./config.json');
const Discord = require('discord.js');

// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, 
        'GUILD_PRESENCES', 
        'GUILD_MEMBERS', 
        'GUILD_MESSAGES',
        'DIRECT_MESSAGES', 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});

var role = ''

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');

    const guild = client.guilds.cache.get(guildId)
    let commands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'book',
        description: 'Book a mentoring session!',
        options: [
            {
                name: 'team_number',
                description: 'Enter your team number',
                required: true,
                type: 'INTEGER',
            },
            {
                name: 'describe_the_issue',
                description: 'Describe the issue that you need help on',
                required: true,
                type: 'STRING',
            },
            {
                name: 'preferred_mentor',
                description: 'Enter your preferred mentor if you have',
                type: 'MENTIONABLE',
                required: false,
            },
        ],
    })
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

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const {commandName, options} = interaction;

    if (commandName === 'book') {

    } 
});

// Login to Discord with your client's token
client.login(token);