let builder = require("botbuilder");

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            session.beginDialog('/scoopDate')
        },
        (session, results) => {
            session.privateConversationData.scoopDate = results.scoopDate;
            session.beginDialog('/scoopTime')
        },
        (session, results) => {
            session.privateConversationData.scoopTime = results.scoopTime;
            session.sendTyping();
            session.beginDialog('/scoopDonateResell')
        },
        // (session, results) => {
        //     session.privateConversationData.scoopType = results.scoopType;
        //     session.sendTyping();
        //     builder.Prompts.text(session, "Who should the Tax-Receipt form be made out to?");
        // },
        // (session, results) => {
        //     session.privateConversationData.scoopReceiptName = results.response;
        //     session.sendTyping();
        //     session.beginDialog('/scoopItemTypes')
        // },
        // (session, results) => {
        //     session.privateConversationData.scoopItems = results.scoopItems;
        //     session.sendTyping();
        //     builder.Prompts.text(session, "What are some of your favorite stores and brands?");
        // },
        // (session, results) => {
        //     console.log(session.privateConversationData);
        //     session.privateConversationData.scoopItems = results.scoopItems;
        //     console.log(session.privateConversationData);
        //     session.beginDialog('/scoop_bags')
        // },
        // (session, results) => {
        //     session.privateConversationData.favorites = results.response;
        //     session.beginDialog('/scoopSize')
        // },
        (session, results) => {
            //session.privateConversationData.favorites = results.response;
            session.privateConversationData.scoopDonateResell = results.scoopDonateResell;

            session.sendTyping();
            if(session.userData.scoopAddress) {
                builder.Prompts.choice(session, "Would you like to use the address of your previous Scoop (" + session.userData.scoopAddress + ")?", "yes|no",
                    {
                        maxRetries: 3,
                        retryPrompt: 'Please answer yes or no...',
                        listStyle: builder.ListStyle["button"]
                    }
                ); 
            } else {
                session.beginDialog('/scoopAddress')
            }
        },
        (session, results, next) => {
            if(results.scoopAddress) {
                session.userData.scoopAddress = results.scoopAddress
                session.privateConversationData.scoopAddress = results.scoopAddress;
                next();
            }

            else if (results.response.entity === "yes") {
                session.privateConversationData.scoopAddress = session.userData.scoopAddress;
                next();
            } else {
                session.beginDialog('/scoopAddress')
            }
        },
        // (session, results) => {
        //     session.privateConversationData.scoopAddress = results.scoopAddress;
        //     session.sendTyping();
        //     builder.Prompts.choice(session, "Do you have any special instructions for your Scoop driver?", "yes|no",
        //         {
        //             maxRetries: 3,
        //             retryPrompt: 'Please answer yes or no...',
        //             listStyle: builder.ListStyle["button"]
        //         }
        //     ); 
        // },
        // (session, results, next) => {
        //     if (results.response.entity === "yes") {
        //         session.sendTyping();
        //         builder.Prompts.text(session, "What are the special instructions?");
        //     } else {
        //         next();
        //     }
        // },
        // (session, results) => {
        //     session.privateConversationData.specialInstructions = results.response;
        //     session.beginDialog('/scoop_photos')
        // },
        // (session, results) => {
        //     session.privateConversationData.scoopPhotos = results.scoopPhotos;
        //     session.beginDialog('/scoop_coupon')
        // },
        (session, results, next) => {
            // if(results.response) {
            //     session.privateConversationData.specialInstructions = results.response;
            // }
            
            // if (session.privateConversationData.scoopAddress) {
            //     session.beginDialog('/scoopPayment');
            // }

            if (results.scoopAddress) {
                session.userData.scoopAddress = results.scoopAddress
                session.privateConversationData.scoopAddress = results.scoopAddress
            }

            session.beginDialog('/scoopConfirmation');
            
            //session.beginDialog('/scoopPayment');
            
            //session.privateConversationData.scoopCoupon = results.scoopCoupon;

            // session.sendTyping();
            // session.send("Items: " + session.privateConversationData.scoopItems +
            //             "\n\nSize: " + session.privateConversationData.scoopSize + 
            //             "\n\nAddress: " + session.privateConversationData.scoopAddress +
            //             "\n\nDate: " + moment(session.privateConversationData.scoopTime).format('MMMM Do, YYYY') +
            //             "\n\nTime: " + moment(session.privateConversationData.scoopTime).format('h:mm a zz') +
            //             "\n\nEmail: " + session.userData.email +
            //             "\n\nPhone: " + session.userData.phoneNumber);
            
            // session.sendTyping();
            // builder.Prompts.choice(session, "Almost done! Are these details of your scoop correct?", "yes|no",
            //     {
            //         maxRetries: 3,
            //         retryPrompt: 'Please answer yes or no...',
            //         listStyle: builder.ListStyle["button"]
            //     }
            // ); 
        },
        // (session, results) => {
            // if (results.response.entity === "yes") {
            //     var options = {
            //         method: 'POST',
            //         body: {
            //             appointmentTypeID: 792214,
            //             datetime:          session.privateConversationData.scoopTime,
            //             firstName:         session.userData.firstName,
            //             lastName:          session.userData.firstName,
            //             email:             session.userData.email,
            //             phone:             session.userData.phoneNumber,
            //             fields: [
            //                 {id: 1587117, value: session.privateConversationData.scoopType},
            //                 {id: 1178786, value: session.privateConversationData.scoopReceiptName},
            //                 {id: 782902, value: session.privateConversationData.scoopItems},
            //                 {id: 1854126, value: session.privateConversationData.favorites},
            //                 {id: 782905, value: session.privateConversationData.scoopAddress},
            //                 {id: 782911, value: session.privateConversationData.specialInstructions},
            //                 {id: 949729, value: ''}
            //             ]
            //         }
            //     };

            //     // TODO: Move this to Azure Function (https://docs.botframework.com/en-us/azure-bot-service/templates/proactive/)
            //     acuity.request('/appointments', options, function (err, res, appointment) {
            //         //console.log(appointment);
            //         session.sendTyping();
            //         session.send("Great. We've scheduled your appointment. Here's your confirmation: " + appointment.confirmationPage /*JSON.stringify(appointment, null, '  ')*/);
            //         session.endConversation();
            //     });

            // } else {
            //     // builder.Prompts.choice(session, "What would you like to change?", "Items | Number of Bags | Size | Address | Date | Time",
            //     //     {
            //     //         listStyle: builder.ListStyle["button"]
            //     //     }
            //     // );
            //     session.sendTyping();
            //     session.send("Let's try this again...");
            //     session.replaceDialog('/scheduleScoop');
            // }
        // }
    ])
}