const {sendReminder, parseEventsJson, mod} = require('./reminder.js');
const Discord = require('discord.js');
const {Client, Intents} = require('discord.js');
const {guildId, token} = require('./config.json');
const cron = require('cron');

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

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const {commandName, options} = interaction;

    if (commandName === 'book') {
        const teamNum = options.getInteger('team_number')
        const mentor = options.getMentionable('preferred_mentor') || '<@&894440768977109005>' //mention @Mentor
        const help = options.getString('describe_the_issue')

        interaction.reply({
            content: `Thank you for booking! 🙌 Your team will get notified once the mentor is available.`
        })

        const channel = client.channels.cache.get('909261789802405909'); //fetch #mentoring-queue channel
        const line = ('-------------------------------------------');
        const reactionMessage = await channel.send(`${line}\n**BOOKED!**\n` + 
        `Team Number: ${teamNum}\nParticipant: <@${interaction.user.id}>\nMentor: ${mentor}\nHelp: ${help}\n` +
        `> 🔔 - ping the team \n> ✅ - tick when the team is in the mentoring room`);

        try{
            await reactionMessage.react("🔔");
            await reactionMessage.react("✅");
        }catch(err){
            channel.send('Error sending emojis!');
            throw err;
        }

        const filter = (reaction, user) => {
            const guild = client.guilds.cache.get(guildId)
            const permission = guild.members.cache.find((member) => member.id === user.id).permissions.has('ADMINISTRATOR') || //access for admins
            guild.members.cache.find((member) => member.id === user.id).permissions.has('MANAGE_MESSAGES'); //access for mentors

            if(permission === false){
                reaction.users.remove(user.id); //Users cannot react if they are not admins nor mentors 
            }
            return permission;
        }

        const collector = reactionMessage.createReactionCollector({
            filter,
            time: 1000*100000
        })

        collector.on('collect', (reaction, user) => {
            if (reaction.emoji.name === "🔔")
            {
                let teamChannelId = '';
                let teamRole = '';
                switch(teamNum){
                    case 1:
                        teamChannelId = '895532971501690880';
                        teamRole = '909689031615447051';
                        break;
                    case 2:
                        teamChannelId = '906470785135300638'
                        teamRole = '909678263545253888';
                        break;
                    case 3:
                        teamChannelId = '906471142473207808'
                        teamRole = '909678700050649179';
                        break;
                    case 4:
                        teamChannelId = '906471162547159051'
                        teamRole = '909689493441888287';
                        break;
                    case 5:
                        teamChannelId = '906471191840182282'
                        teamRole = '909689515130621962';
                        break;                   
                    case 6:
                        teamChannelId = '906471212375486484'
                        teamRole = '909689539067514900';
                        break;                        
                    case 7:
                        teamChannelId = '906471238233366548'
                        teamRole = '909690060067184640';
                        break;                       
                    case 8:
                        teamChannelId = '906471260744212480'
                        teamRole = '909689589080403979';
                        break;                        
                    case 9:
                        teamChannelId = '906471286463668236'
                        teamRole = '909689618356650005';
                        break;                        
                    case 10:
                        teamChannelId = '906474205321760770'
                        teamRole = '909689650233352232';
                        break;  
                    case 11:
                        teamChannelId = '911196812717731851';
                        teamRole = '911197439434821642';
                        break;
                    case 12:
                        teamChannelId = '911196843923370084'
                        teamRole = '911197621681541140';
                        break;
                    case 13:
                        teamChannelId = '911196871421206569'
                        teamRole = '911197786660294656';
                        break;
                    case 14:
                        teamChannelId = '911196901825732608'
                        teamRole = '911197881044697118';
                        break;
                    case 15:
                        teamChannelId = '911196935422115861'
                        teamRole = '911198022468239390';
                        break;                   
                    case 16:
                        teamChannelId = '911196995669065748'
                        teamRole = '911198112566091806';
                        break;                        
                    case 17:
                        teamChannelId = '911197024152596480'
                        teamRole = '911198338278391818';
                        break;                       
                    case 18:
                        teamChannelId = '911197054443864135'
                        teamRole = '911198416770584606';
                        break;                        
                    case 19:
                        teamChannelId = '911197157267222528'
                        teamRole = '911198503085150219';
                        break;                        
                    case 20:
                        teamChannelId = '911197207456260116'
                        teamRole = '911198565139906610';
                        break;   
                }
                    
                if(teamChannelId !== ''){
                    const teamChannel = client.channels.cache.get(teamChannelId);
                    teamChannel.send(`<@&${teamRole}>, <@${user.id}> is waiting in the mentoring room NOW!`);
                } else {
                    user.send("Invalid team number. Kindly notify the team manually instead.")
                }
            } 
            else if (reaction.emoji.name === "✅")
            {
                reactionMessage.delete();
            }
        })
    } 
});

// Login to Discord with your client's token
client.login(token);