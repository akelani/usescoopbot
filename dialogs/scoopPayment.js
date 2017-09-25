let builder = require("botbuilder");
let payments = require('../helpers/payments');

let paymentRequest = createPaymentRequest(0, 0);

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            session.sendTyping();
            session.send('Awesome! Now let\'s pay your $5 Scoop pickup deposit');

            var buyCard = new builder.HeroCard(session)
                .title('Scoop Pickup Deposit')
                //.subtitle('')
                .text('Scoop will maximize the value of your items. Requires: $5 Non-Refundable deposit.')
                // .images([
                //     new builder.CardImage(session).url(product.imageUrl)
                // ])
                .buttons([
                    new builder.CardAction(session)
                    .title('Pay')
                    .type('payment')
                    .value(paymentRequest)
                ]);

            session.send(new builder.Message(session).addAttachment(buyCard));

            session.beginDialog('/scoopConfirmation');
        }
    ]);
}

// PaymentRequest with default options
function createPaymentRequest(cartId, product) {
//   if (!cartId) {
//     throw new Error('cartId is missing');
//   }

//   if (!product) {
//     throw new Error('product is missing');
//   }

  // PaymentMethodData[]
  var paymentMethods = [{
    supportedMethods: [payments.MicrosoftPayMethodName],
    data: {
      mode: process.env.PAYMENTS_LIVEMODE === 'true' ? null : 'TEST',
      merchantId: process.env.PAYMENTS_MERCHANT_ID,
      supportedNetworks: ['visa', 'mastercard'],
      supportedTypes: ['credit']
    }
  }];

  // PaymentDetails
  var paymentDetails = {
    total: {
      label: 'Total',
      amount: { currency: 'USD', value: '5.00' },
      pending: true
    },
    displayItems: [
      {
        label: 'Deposit',
        amount: { currency: 'USD', value: '5.00' }
      }],
    // until a shipping address is selected, we can't offer shipping options or calculate taxes or shipping costs
    // shippingOptions: []
  };

  // PaymentOptions
  var paymentOptions = {
    requestPayerName: true,
    requestPayerEmail: true,
    requestPayerPhone: true,
    requestShipping: false,
    // shippingType: 'shipping'
  };

  // PaymentRequest
  return {
    id: 1,
    expires: '1.00:00:00',          // 1 day
    methodData: paymentMethods,     // paymethodMethods: paymentMethods,
    details: paymentDetails,        // paymentDetails: paymentDetails,
    options: paymentOptions         // paymentOptions: paymentOptions
  };
}
