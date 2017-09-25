let moment = require('moment-timezone');
let Acuity = require('acuityscheduling');
let acuity = Acuity.basic({
  userId: process.env.ACUITY_USER_ID,
  apiKey: process.env.ACUITY_API_KEY
});
