const {sendReminder, parseEventsJson, mod} = require('./reminder.js');
const Discord = require('discord.js');
const {Client, Intents} = require('discord.js');
const {guildId, token} = require('./config.json');
const cron = require('cron');

// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS,
        'GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES',
        'DIRECT_MESSAGES',
        Intents.FLAGS.GUILD_MESSAGES]
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

//Reminder Feature
const CHECK_INTERVAL = 60000;
const MIN_BEFORE_EVENT = 10;
const CHANNEL_IDS = [
    "897009510047158273"
];

client.once('ready', () => {
    setInterval(() => {
        events = parseEventsJson();
        var currDate = new Date();
        events.forEach(event => {
            const remindMinute = mod(event.event_datetime.getMinutes() - MIN_BEFORE_EVENT, 60)
            let eventHours = event.event_datetime.getHours()
            var eventDate = event.event_datetime.getDate()
            var eventMonth = event.event_datetime.getMonth()
            var eventYear = event.event_datetime.getFullYear()

            if (remindMinute != event.event_datetime.getMinutes() - MIN_BEFORE_EVENT)
                eventHours -= 1

            if (currDate.getMonth() === eventMonth && currDate.getDate() === eventDate &&
                currDate.getFullYear() === eventYear && currDate.getHours() === eventHours
                && currDate.getMinutes() === remindMinute) {
                CHANNEL_IDS.forEach(channel_id => {
                    client.channels.fetch(channel_id)
                        .then(channel => sendReminder(channel,
                            `@here ${event.name} is in ${MIN_BEFORE_EVENT} minutes 🔥🔥`)
                        )
                        .catch(console.error);
                })
            }

            // Make announcement to announcement channel
            if (currDate.getMonth() === eventMonth && currDate.getDate() === eventDate &&
                currDate.getFullYear() === eventYear && currDate.getHours() === eventHours &&
                currDate.getMinutes() === event.event_datetime.getMinutes()) {

                console.log("Inside announcements\n")

                var guild = client.guilds.cache.get(guildId);
                role = guild.roles.cache.find(r => r.name === "@everyone");

                const hackEmbed = new Discord.MessageEmbed()
                    .setTitle(`Agenda Item: ${event.name}`)
                    .setDescription(`\nWhere: ${event.event_link}\nWhen: ${event.event_datetime}\n **YEAH, IT'S NOW**❗`)
                    .setColor("#34a853");

                client.channels.cache.get('895532494856798238').send({
                    embeds: [hackEmbed],
                    content: `Oi ${role.name} getcho butts over here now 🔥`
                })
                    .then(sentMessage => {
                        sentMessage.react('🔥');
                        sentMessage.react('⏰');
                        sentMessage.react('🔺')
                    });
            }
        })
    }, CHECK_INTERVAL)
})

// Login to Discord with your client's token
client.login(token);