module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            session.sendTyping();
            session.beginDialog('validators:email', {
                prompt: "What's your email address?",
                retryPrompt: "ummm...that doesn't look like a valid email address. Send it again please.",
                maxRetries: 3
            });
        },
        (session, results) => {
            //session.send("Your response: %s", results.response);
            if (results.resumed) {
                session.sendTyping();
                session.send("Got it. Well in the meantime, check out our social media and let us know what you think!");
                session.endConversation();
            } else {
                session.userData.email = results.response;
                session.sendTyping();
                session.send("Perfect! We have added you to the list. #UseScoop");
                session.endConversation();   
            }
        }
    ])
};