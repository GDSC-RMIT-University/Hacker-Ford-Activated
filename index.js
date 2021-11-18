const {Client, Intents} = require('discord.js');
const {guildId, token} = require('./config.json');
const Discord = require('discord.js');
const eventsJSON = require('./events.json');
const parsedEvents = eventsJSON.events.map(event => {
    return {
        ...event,
        event_datetime: new Date(event.event_datetime)
    }
});

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

    commands?.create({
        name: 'help',
        description: 'Summon the organisers right here, right now!'
    })

    commands?.create({
        name: 'info',
        description: 'Want to know the general info of HackVision 2021?'
    })

    commands?.create({
        name: 'next',
        description: "Check out what\'s next on our schedule!"
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
    } else if (commandName === 'help'){
        interaction.reply({
            content: 'Hey <@&895533911348748329>, <@' + interaction.user.id + '> needs your help!!'
        })
    } else if (commandName === 'info'){
        interaction.reply({
            content: 'Check out <#908659472740798464> for the general info of HackVision 2021!'
        })
    } else if (commandName === 'next'){
        for (var i in parsedEvents){
            // get time now
            var now = new Date();
            if (now > new Date("2021-11-21T17:00:00.00")){
                interaction.reply({
                    content: 'HackVision 2021 has ended! Thank you for coming!'
                })
            }

            // get next event
            var next;
            if (parsedEvents[i].event_datetime > now){
                next = parsedEvents[i]
                break
            }

        }
        
        if (typeof(next) !== "undefined"){
            // calculate time difference
            var diff = next.event_datetime - now
            var time_str = ' ';
            
            // calculate hours diff
            var hours = Math.floor(diff / 1000 / 60 / 60);
            if (hours > 1){
                time_str += hours + ' hours '
            } else if (hours === 1){
                time_str += hours + ' hour '
            }
            diff -= hours * 1000 * 60 * 60;
            
            // calculate minute diff
            var minutes = Math.floor(diff / 1000 / 60);
            if (minutes > 1){
                time_str += minutes + ' minutes '
            } else if (minutes === 1){
                time_str += minutes + ' minute '
            }

            interaction.reply({
                content: 'Next event: ' + next.name + ', coming up in ' + time_str + '!'
            })
        
        } else {
            interaction.reply({
                content: 'This is the last event of HackVision 2021.'
            })
        }
        
    }
});

// Login to Discord with your client's token
client.login(token);