let builder = require("botbuilder");
let moment = require('moment-timezone');
let Acuity = require('acuityscheduling');
let acuity = Acuity.basic({
  userId: process.env.ACUITY_USER_ID,
  apiKey: process.env.ACUITY_API_KEY
});

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            session.sendTyping();
            session.send("Your name: " + session.userData.firstName + " " + session.userData.lastName +
                        "\n\nScoop Date: " + moment(session.privateConversationData.scoopTime).format('MMMM Do, YYYY') +
                        "\n\nScoop Time: " + moment(session.privateConversationData.scoopTime).format('h:mm a zz') +
                        "\n\nDonate/Resell: " + session.privateConversationData.scoopDonateResell +
                        "\n\nPickup Address: " + session.privateConversationData.scoopAddress +
                        "\n\nYour Email: " + session.userData.email +
                        "\n\nYour Phone: " + session.userData.phoneNumber);
                        
            session.sendTyping();
            builder.Prompts.choice(session, "Almost done! Are these details of your scoop correct?", "yes|no",
                {
                    maxRetries: 3,
                    retryPrompt: 'Please answer yes or no...',
                    listStyle: builder.ListStyle["button"]
                }
            ); 
        },
        (session, results) => {
            if (results.response.entity === "yes") {
                session.save();
                
                var options = {
                    method: 'POST',
                    body: {
                        appointmentTypeID: 792214,
                        datetime:          session.privateConversationData.scoopTime,
                        firstName:         session.userData.firstName,
                        lastName:          session.userData.lastName,
                        email:             session.userData.email,
                        phone:             session.userData.phoneNumber,
                        fields: [
                            {id: 1587117, value: session.privateConversationData.scoopDonateResell},
                            {id: 1178786, value: session.userData.firstName + ' ' + session.userData.lastName},
                            {id: 782902, value: ' '},
                            {id: 1854126, value: ' '},
                            {id: 782905, value: session.privateConversationData.scoopAddress},
                            {id: 782911, value: ' '},
                            {id: 949729, value: ' '}
                        ]
                    }
                };

                // TODO: Move this to Azure Function (https://docs.botframework.com/en-us/azure-bot-service/templates/proactive/)
                acuity.request('/appointments', options, function (err, res, appointment) {
                    console.log(appointment);
                    console.log(err);

                    if (appointment.status_code == 400) {
                        console.log("Oops...something went wrong.")
                        session.sendTyping();
                        session.send("Oops...something went wrong with your request.  We're notifying the Scoop team right now to fix things.");
                        session.sendTyping();
                        session.send("We'll get back to you ASAP...");
                        session.endConversation();
                    } else {

                        session.sendTyping();

                        var card = new builder.HeroCard(session)
                            .title("Awesome! One more step!")
                            .subtitle("We've scheduled your Scoop! Now let's pay your $5 Scoop deposit! ")
                            .text("Visit the link below to pay. Thank you! We'll see you soon! ✌🏾")
                            .images([
                                builder.CardImage.create(session, 'http://i0.kym-cdn.com/photos/images/newsfeed/000/185/885/SANDCASTLES.png')
                            ])
                            .buttons([
                                builder.CardAction.openUrl(session, appointment.confirmationPage, 'Pay Now')
                            ]);

                        // attach the card to the reply message
                        var msg = new builder.Message(session).addAttachment(card);
                        session.send(msg);

                        // session.sendTyping();
                        // session.send("Great. We've scheduled your appointment. Here's your confirmation: " + appointment.confirmationPage /*JSON.stringify(appointment, null, '  ')*/);
                        // session.sendTyping();
                        // session.send("Thank you! We'll see you soon! ✌🏾");
                        session.endConversation();
                    }
                });

            } else {
                // builder.Prompts.choice(session, "What would you like to change?", "Items | Number of Bags | Size | Address | Date | Time",
                //     {
                //         listStyle: builder.ListStyle["button"]
                //     }
                // );
                session.sendTyping();
                session.send("Let's try this again...");
                session.replaceDialog('/scheduleScoop');
            }
        }
    ]);
}