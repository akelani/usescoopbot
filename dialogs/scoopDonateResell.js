let builder = require("botbuilder");

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            session.sendTyping();
            builder.Prompts.choice(session, "What would you like Scoop to do with your Items?", "Resell and Donate | Donate only",
                {
                    maxRetries: 3,
                    retryPrompt: 'Not a valid option.',
                    listStyle: builder.ListStyle["button"]
                }
            );
        },
        (session, results) => {
            session.endDialogWithResult({ 
                scoopDonateResell: results.response.entity
            });
        }
    ])
};