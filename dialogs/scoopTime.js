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
            // Create separate time dialog to get availble time slots
            acuity.request('/availability/times?date=' + session.privateConversationData.scoopDate + '&appointmentTypeID=792214' /*+ appointmentType.id*/, function (err, res, times) {
                console.log("Grabbing available times from Acuity...");

                console.log(times);
                const times_arr = times.map((time) => {
                    if(time['slotsAvailable'] > 0) {
                        console.log(time['time'])
                        return time['time'];
                    }
                });

                session.privateConversationData.times_arr = times_arr;

                const format_time_arr = times_arr.map((time) => {
                    return moment(time).format("h:mm a zz") + ' - ' + moment(time).add(2, 'hours').format("h:mm a z");
                });

                session.sendTyping();
                // Create separate time dialog to get availble date slots
                builder.Prompts.choice(session, "What time? (Arrival time is within the 2-hr window.)", format_time_arr,
                    {
                        maxRetries: 3,
                        retryPrompt: 'Please choose a valid time.',
                        listStyle: builder.ListStyle["button"]
                    }
                );
            });
        },
        (session, results) => {
            session.endDialogWithResult({
                scoopTime: session.privateConversationData.times_arr[results.response.index]
                // scoopTime: results.response.entity
            });
        }
    ])
};