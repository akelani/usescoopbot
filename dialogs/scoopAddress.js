let builder = require("botbuilder");

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            session.sendTyping();
            // Create separate address dialog to validate address
            builder.Prompts.text(session, "Which address would you like us to pick up your Scoop from?"); 

            // locationDialog.getLocation(session, { 
            //         prompt: "What is the pickup location of the scoop?",
            //         requiredFields: 
            //         locationDialog.LocationRequiredFields.streetAddress |
            //         locationDialog.LocationRequiredFields.locality |
            //         locationDialog.LocationRequiredFields.region |
            //         locationDialog.LocationRequiredFields.postalCode
            //     }
            // );
        },
        (session, results) => {
            session.endDialogWithResult({
                scoopAddress: results.response
            });
            
            // if (results.response) {
            //     var place = results.response;
            //     var scoop_location = place.streetAddress + ", " + place.locality + ", " + place.region + ", " + place.country + " (" + place.postalCode + ")";
            //     session.send(scoop_location);
            //     session.endDialogWithResult({
            //         scoopAddress: scoop_location
            //     });
            // }
        }
    ])
}