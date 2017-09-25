let builder = require("botbuilder");

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            session.sendTyping();
            builder.Prompts.choice(session, "What size?", "Small | Medium | Large | Extra Large",
                {
                    maxRetries: 3,
                    retryPrompt: 'Please choose a valid size.',
                    listStyle: builder.ListStyle["button"]
                }
            );
        },
        (session, results) => {
            session.endDialogWithResult({
                scoopSize: results.response.entity
            });
        }
    ])
};