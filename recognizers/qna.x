let builder = require("botbuilder");
var bbcs = require('botbuilder-cognitiveservices');

module.exports = new bbcs.QnAMakerRecognizer({
    knowledgeBaseId: process.env.QNA_ID, 
    subscriptionKey: process.env.QNA_KEY
});