module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            session.sendTyping();
            session.beginDialog('validators:numberGreaterThanZero', 
                {
                    prompt: "How many bags do you need?",
                    retryPrompt: "Please enter a number greater than zero.",
                    maxRetries: 3
                }
            );
        },
        (session, results) => {
            session.endDialogWithResult({
                scoopNumOfBags: results.response
            });
        }
    ])
};