let builder = require("botbuilder");

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            session.sendTyping();
            builder.Prompts.choice(session, "Would you like us to tell you when we are in that zip code?", "yes|no",
                {
                    maxRetries: 3,
                    retryPrompt: 'Please answer yes or no...',
                    listStyle: builder.ListStyle["button"]
                }
            );
        },
        (session, results) => {
            if (results.response.entity === "yes") { 
                session.sendTyping();
                session.send("Great!");
                session.beginDialog('/ask_email');
            } else {
                session.sendTyping();
                session.send("Got it. Well in the meantime, check out our social media and let us know what you think! ");
                session.endDialog();
            }
        }
    ])
};