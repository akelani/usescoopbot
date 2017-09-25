// /*-----------------------------------------------------------------------------
// A simple echo bot for the Microsoft Bot Framework. 
// -----------------------------------------------------------------------------*/

// var restify = require('restify');
// var builder = require('botbuilder');

// // Setup Restify Server
// var server = restify.createServer();
// server.listen(process.env.port || process.env.PORT || 3978, function () {
//    console.log('%s listening to %s', server.name, server.url); 
// });
  
// // Create chat connector for communicating with the Bot Framework Service
// var connector = new builder.ChatConnector({
//     appId: process.env.MicrosoftAppId,
//     appPassword: process.env.MicrosoftAppPassword,
//     stateEndpoint: process.env.BotStateEndpoint,
//     openIdMetadata: process.env.BotOpenIdMetadata 
// });

// // Listen for messages from users 
// server.post('/api/messages', connector.listen());

// /*----------------------------------------------------------------------------------------
// * Bot Storage: This is a great spot to register the private state storage for your bot. 
// * We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
// * For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
// * ---------------------------------------------------------------------------------------- */

// // Create your bot with a function to receive messages from the user
// var bot = new builder.UniversalBot(connector, function (session) {
//     session.send("You said: %s", session.message.text);
// });

process.chdir(__dirname);

"use strict";
let builder = require("botbuilder");
let restify = require('restify');
let _ = require('lodash');
let fs = require('fs');
let path = require('path');
let utils = require('./helpers/utils');
require('dotenv').config();
//let locationDialog = require('botbuilder-location');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

let bot = new builder.UniversalBot(connector, session => session.beginDialog('/default'));

//authentication
if(process.env.AUTH_PROVIDER_NAME)
    bot.auth = authenticationService.initialize(server, bot);

//recognizers
utils.getFiles('./recognizers')
    .map(file => Object.assign(file, { recognizer: require(file.path) }))
    .forEach(r => bot.recognizer(r.recognizer));

//dialogs
utils.getFiles('./dialogs')
    .map(file => Object.assign(file, { fx: require(file.path) }))
    .forEach(dialog => dialog.fx(dialog.name, bot));

//events
// utils.getFiles('./events')
//     .map(file => Object.assign(file, { fx: require(file.path) }))
//     .forEach(event => event.fx(event.name, bot));

//middleware
// utils.getFiles('./middleware')
//     .map(file => require(file.path))
//     .forEach(mw => bot.use(mw));

//libraries
utils.getFiles('./libraries')
    .map(file => require(file.path))
    .forEach(library => bot.library(library.createLibrary()));

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });

// if (useEmulator) {
//     let server = restify.createServer();
//     server.post('/api/messages', connector.listen());    
//     server.post('/api/notify', function (req, res) {
//         console.log('req: ' + req.body.action);
//         res.status(200);
//         res.end();

//         // console.log('res: ' + res);
//         // // Process posted notification
//         // var address = JSON.parse(req.body.address);
//         // var notification = req.body.notification;

//         // // Send notification as a proactive message
//         // var msg = new builder.Message()
//         //     .address(address)
//         //     .text(notification);
//         // bot.send(msg, function (err) {
//         //     // Return success/failure
//         //     res.status(err ? 500 : 200);
//         //     res.end();
//         // });
//     });
//     server.listen(3978, function() {
//         console.log('test bot endpont at http://localhost:3978/api/messages');
//     });
//     server.use(restify.bodyParser());
//     server.use(restify.queryParser());
// } 
// else {
//     module.exports = { default: connector.listen() }
// }

// connector.onInvoke((invoke, callback) => {
//   console.log('onInvoke', invoke);

//   // This is a temporary workaround for the issue that the channelId for "webchat" is mapped to "directline" in the incoming RelatesTo object
//   invoke.relatesTo.channelId = invoke.relatesTo.channelId === 'directline' ? 'webchat' : invoke.relatesTo.channelId;

//   var storageCtx = {
//     address: invoke.relatesTo,
//     persistConversationData: true,
//     conversationId: invoke.relatesTo.conversation.id
//   };

//   connector.getData(storageCtx, (err, data) => {
//     // var cartId = data.conversationData[CartIdKey];
//     // if (!invoke.relatesTo.user && cartId) {
//     //   // Bot keeps the userId in context.ConversationData[cartId]
//     //   var userId = data.conversationData[cartId];
//     //   invoke.relatesTo.useAuth = true;
//     //   invoke.relatesTo.user = { id: userId };
//     // }

//     // Continue based on PaymentRequest event.
//     var paymentRequest = null;
//     switch (invoke.name) {
//       case payments.Operations.UpdateShippingAddressOperation:
//       case payments.Operations.UpdateShippingOptionOperation:
//         paymentRequest = invoke.value;

//         // Validate address AND shipping method (if selected).
//         checkout
//           .validateAndCalculateDetails(paymentRequest, paymentRequest.shippingAddress, paymentRequest.shippingOption)
//           .then(updatedPaymentRequest => {
//             // Return new paymentRequest with updated details.
//             callback(null, updatedPaymentRequest, 200);
//           }).catch(err => {
//             // Return error to onInvoke handler.
//             callback(err);
//             // Send error message back to user.
//             bot.beginDialog(invoke.relatesTo, 'checkout_failed', {
//               errorMessage: err.message
//             });
//           });

//         break;

//       case payments.Operations.PaymentCompleteOperation:
//         var paymentRequestComplete = invoke.value;
//         paymentRequest = paymentRequestComplete.paymentRequest;
//         var paymentResponse = paymentRequestComplete.paymentResponse;

//         // Validate address AND shipping method.
//         checkout
//           .validateAndCalculateDetails(paymentRequest, paymentResponse.shippingAddress, paymentResponse.shippingOption)
//           .then(updatedPaymentRequest =>
//             // Process payment.
//             checkout
//               .processPayment(updatedPaymentRequest, paymentResponse)
//               .then(chargeResult => {
//                 // Return success.
//                 callback(null, { result: "success" }, 200);
//                 // Send receipt to user.
//                 bot.beginDialog(invoke.relatesTo, 'checkout_receipt', {
//                   paymentRequest: updatedPaymentRequest,
//                   chargeResult: chargeResult
//                 });
//               })
//           ).catch(err => {
//             // Return error to onInvoke handler.
//             callback(err);
//             // Send error message back to user.
//             bot.beginDialog(invoke.relatesTo, 'checkout_failed', {
//               errorMessage: err.message
//             });
//           });

//         break;
//     }

//   });
// });
