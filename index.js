const { sendReminder, parseEventsJson } = require('./reminder.js');
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
const CHECK_INTERVAL = 1000;
const ROLE_DEV_CHANNEL_ID = "907410177463042118";
const MIN_BEFORE_EVENT = 10;
const TEAM_CHANNEL_IDS = ["907410177463042118"];
client.once('ready', () => {
    setInterval(() => {
        events = parseEventsJson();
        var currDate = new Date();
        events.forEach(event => {
            if (currDate.getHours() === event.event_datetime.getHours() && 
                currDate.getMinutes() === event.event_datetime.getMinutes() - MIN_BEFORE_EVENT)
            {
                TEAM_CHANNEL_IDS.forEach(channel_id => {
                    client.channels.fetch(channel_id)
                        .then(channel => sendReminder(channel,`${event.name} starts in ${MIN_BEFORE_EVENT} minutes! 🔥🔥`))
                        .catch(console.error);
                })
            }
        })
    }, CHECK_INTERVAL)
})

// Login to Discord with your client's token
client.login(token);