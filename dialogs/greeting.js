let builder = require("botbuilder");
let _ = require('lodash');

const zipCodes = [90008];

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            if(!session.userData.firstName ||
                !session.userData.email ||
                !session.userData.phoneNumber ||
                !session.userData.zipCode) {
                    session.replaceDialog('/firstRun');
                } else {
                    session.sendTyping();
                    session.send('Welcome back ' + session.userData.firstName);
                    session.sendTyping();
                    builder.Prompts.choice(session, "Would you like to schedule a scoop right now?", "yes|no",
                        {
                            maxRetries: 3,
                            retryPrompt: 'Please answer yes or no...',
                            listStyle: builder.ListStyle["button"]
                        }
                    ); 
                }
        },
        (session, results) => {
            if (results.response.entity === "yes") {
                session.beginDialog('/scheduleScoop')
            } else {
                session.sendTyping();
                session.send("No worries! Come back when you're ready to schedule!");
            }
        }
    ])
    .triggerAction({ matches: name })
};