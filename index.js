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
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});

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

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

    const { commandName, options } = interaction

    if (commandName === 'book'){

    }
});

// Login to Discord with your client's token
client.login(token);