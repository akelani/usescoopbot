let builder = require("botbuilder");

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            session.sendTyping();
            builder.Prompts.choice(session, "What would you like us to scoop?", "Clothes | Shoes | Baby Items | Books | Linens | Electronics | Other",
                {
                    maxRetries: 3,
                    retryPrompt: 'Not a valid option.',
                    listStyle: builder.ListStyle["button"]
                }
            );
        },
        (session, results) => {
            session.endDialogWithResult({ 
                scoopItems: results.response.entity
            });
        }
    ])
};