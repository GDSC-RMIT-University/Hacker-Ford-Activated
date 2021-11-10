/* Reminder Feature */
const parseEventsJson = () => {
    const eventsJSON = require('./events.json');
    const parsedEvents = eventsJSON.events.map(event => {
        return {
            ...event,
            event_datetime: new Date(event.event_datetime)
        }
    });
    return parsedEvents;
}

const sendReminder = (channel,message) => {
    if (channel.isText()) {
        channel.send(message)
            .then(console.log("Reminder Sent!"))
            .catch(console.error);
    }
}

exports.parseEventsJson = parseEventsJson;
exports.sendReminder = sendReminder;
