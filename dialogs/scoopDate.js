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

            var month = new Date();
            month = month.getFullYear() + '-' + (month.getMonth() + 1);
            acuity.request('/availability/dates?month=' + month + '&appointmentTypeID=792214' /*+ appointmentType.id*/, function (err, res, dates) {
                console.log("Grabbing available dates from Acuity...");
                console.log(dates);
                const dates_arr = dates.map((date) => {
                    return date['date']
                });

                session.privateConversationData.dates_arr = dates_arr;

                const format_dates_arr = dates_arr.map((date) => {
                    return moment(date).format("dddd, MMMM Do YYYY");
                });

                // Create separate time dialog to get availble date slots
                builder.Prompts.choice(session, "What date?", format_dates_arr,
                    {
                        maxRetries: 3,
                        retryPrompt: 'Please choose a valid date.',
                        listStyle: builder.ListStyle["button"]
                    }
                );
            });

            
        },
        (session, results) => {
            session.endDialogWithResult({
                scoopDate: session.privateConversationData.dates_arr[results.response.index]
                // scoopDate: results.response.entity
            });
        }
    ])
};