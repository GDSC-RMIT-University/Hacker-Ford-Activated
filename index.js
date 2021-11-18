const { sendReminder, parseEventsJson, mod } = require('./reminder.js');
const Discord = require('discord.js');
const {Client, Intents} = require('discord.js');
const {guildId, token} = require('./config.json');

// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, 
        'GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES',
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
const CHECK_INTERVAL = 60000;
const MIN_BEFORE_EVENT = 10;
const CHANNEL_IDS = [
    // "895532971501690880","906470785135300638","906471142473207808","906471162547159051","906471191840182282",
    // "906471212375486484","906471238233366548","906471260744212480","906471286463668236","906474205321760770"
    "897009510047158273"
]; 
client.once('ready', () => {
    setInterval(() => {
        events = parseEventsJson();
        var currDate = new Date();
        events.forEach(event => {
            const remindMinute = mod(event.event_datetime.getMinutes() - MIN_BEFORE_EVENT, 60)
            let remindHours = event.event_datetime.getHours()
            if(remindMinute != event.event_datetime.getMinutes() - MIN_BEFORE_EVENT)
                remindHours -= 1

            if (currDate.getHours() === remindHours && currDate.getMinutes() === remindMinute)
            {
                CHANNEL_IDS.forEach(channel_id => {
                    client.channels.fetch(channel_id)
                        .then(channel => sendReminder(channel,
                            `@here ${event.name} is in ${MIN_BEFORE_EVENT} minutes! 🔥🔥`)
                            )
                        .catch(console.error);
                })
            }
        })
    }, CHECK_INTERVAL)
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

    const { commandName, options } = interaction

    if (commandName === 'book'){

    }
});

// Login to Discord with your client's token
client.login(token);