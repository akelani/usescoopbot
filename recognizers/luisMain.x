let builder = require("botbuilder");

// LUIS
let luisAppId = process.env.LUIS_APP_ID;
let luisAPIKey = process.env.LUIS_API_KEY;
let luisAPIHostName = process.env.LUIS_ENDPOINT || 'api.projectoxford.ai';
const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

module.exports = new builder.LuisRecognizer(LuisModelUrl);