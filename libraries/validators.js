var builder = require('botbuilder');

const PhoneRegex = new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/);
const EmailRegex = new RegExp(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
const ZipCodeRegex = new RegExp(/^[0-9]{5}(?:-[0-9]{4})?$/);
const NumGTZeroRegex = new RegExp(/^[1-9][0-9]*$/);

const lib = new builder.Library('validators');

lib.dialog('phonenumber',
    builder.DialogAction.validatedPrompt(builder.PromptType.text, (response) =>
        PhoneRegex.test(response)));

lib.dialog('email',
    builder.DialogAction.validatedPrompt(builder.PromptType.text, (response) =>
        EmailRegex.test(response)));

lib.dialog('zipcode',
    builder.DialogAction.validatedPrompt(builder.PromptType.text, (response) =>
        ZipCodeRegex.test(response)));

lib.dialog('numberGreaterThanZero',
    builder.DialogAction.validatedPrompt(builder.PromptType.text, (response) => 
        NumGTZeroRegex.test(response)));

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};

module.exports.PhoneRegex = PhoneRegex;
module.exports.EmailRegex = EmailRegex;
module.exports.ZipCodeRegex = ZipCodeRegex;
module.exports.NumGTZeroRegex = NumGTZeroRegex;