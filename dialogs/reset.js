let builder = require("botbuilder");

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, session => {
        session.userData = {}
        session.privateConversationData = {}
        session.endDialog('Everything has been wiped out')
    })
    .triggerAction({
        matches: /^\/reset/i,
        confirmPrompt: "This will wipe everything out. Are you sure?"
    })
}