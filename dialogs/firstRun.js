let builder = require("botbuilder");
let _ = require('lodash');

const zipCodes = [90008];

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            session.userData.hasRun = true;
            console.log("User data: " + JSON.stringify(session.userData));
            console.log("Conversation data: " + JSON.stringify(session.privateConversationData));
            session.sendTyping();
            session.send("Oh great! You found us.");
            session.sendTyping();
            session.send("We are Scoop a company that removes your items (in your closet, dresser) and maximizes their value. Tax write-offs have never been so easy!");
            session.sendTyping();
            session.send("Let's get to know one another! We'll start out with a few questions. I'll remember who you are, so you'll only have to answer these questions once.")
            session.sendTyping();
            builder.Prompts.text(session, "What's your first name?");
        },
        (session, results) => {
            session.userData.firstName = results.response;
            session.sendTyping();
            builder.Prompts.text(session, "How about your last name?");
        },
        (session, results) => {
            session.userData.lastName = results.response;
            session.sendTyping();
            session.beginDialog('validators:email', {
                prompt: "What's your email address?",
                retryPrompt: "ummm...that doesn't look like a valid email address. Send it again please.",
                maxRetries: 3
            });
        },
        (session, results) => {
            session.userData.email = results.response;
            session.sendTyping();
            session.beginDialog('validators:phonenumber', {
                prompt: "What's your cell number, so we can text you updates?",
                retryPrompt: "ummm...that doesn't look like a valid phone number. Send it again please.",
                maxRetries: 3
            });
        },
        (session, results) => {
            session.userData.phoneNumber = results.response;
            session.sendTyping(); 
            session.beginDialog('validators:zipcode', {
                prompt: "Hi " + session.userData.firstName + ". What's your zip code?",
                retryPrompt: "ummm...that doesn't look like a valid zip code. Send it again please.",
                maxRetries: 3
            });  
        },
        (session, results) => {
            session.userData.zipCode = results.response;
            session.save();
            
            if (session.userData.zipCode.indexOf(zipCodes) >= 0) {
                console.log("Found Zip Code");
                session.sendTyping();
                session.send("Oh great, we are currently servicing scoops in that area.");

                session.sendTyping();
                builder.Prompts.choice(session, "Would you like to schedule a scoop right now?", "yes|no",
                    {
                        maxRetries: 3,
                        retryPrompt: 'Please answer yes or no...',
                        listStyle: builder.ListStyle["button"]
                    }
                ); 
            } else {
                console.log("Zip Code not found");
                session.sendTyping();
                session.send("Unfortunately, we are not doing Scoops in that area but we hope to very soon! Click here to find a list of areas we are covering.<Link>");
                session.beginDialog('/waitlist');
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
    ]).triggerAction({
        onFindAction: function (context, callback) {
            // Only trigger if we've never seen user before
            if (!context.userData.hasRun) {
                // Return a score of 1.1 to ensure the first run dialog wins
                callback(null, 1.1);
            } else {
                callback(null, 0.0);
            }
        }
    })
};