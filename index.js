const { sendReminder, parseEventsJson, mod } = require('./reminder.js');
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
const CHECK_INTERVAL = 60000;
const MIN_BEFORE_EVENT = 10;
const TEAM_CHANNEL_IDS = [
    "895532971501690880","906470785135300638","906471142473207808","906471162547159051","906471191840182282",
    "906471212375486484","906471238233366548","906471260744212480","906471286463668236","906474205321760770"
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
                TEAM_CHANNEL_IDS.forEach(channel_id => {
                    client.channels.fetch(channel_id)
                        .then(channel => sendReminder(channel,
                            `@${channel.name} ${event.name} is in ${MIN_BEFORE_EVENT} minutes! 🔥🔥`)
                            )
                        .catch(console.error);
                })
            }
        })
    }, CHECK_INTERVAL)
})

// Login to Discord with your client's token
client.login(token);