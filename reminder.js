/* Reminder Feature */
const parseEventsJson = () => {
    const eventsJSON = require('./events.json');
    const parsedEvents = eventsJSON.events.map(event => {
        return {
            ...event,
            event_datetime: new Date(event.event_datetime)
        }
    });
    console.log(parsedEvents)
    return parsedEvents;
}

const sendReminder = (channel,message) => {
    if (channel.isText()) {
        channel.send(message)
            .then(console.log("Reminder Sent!"))
            .catch(console.error);
    }
}

const mod = (n, m) => {
    return ((n % m) + m) % m;
}

exports.parseEventsJson = parseEventsJson;
exports.sendReminder = sendReminder;
exports.mod = mod;
