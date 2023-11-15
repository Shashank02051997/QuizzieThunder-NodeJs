const twilio = require('twilio');
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;


const sendSMS = (toNumber, messageBody) => {
    const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    return client.messages.create({
        body: messageBody,
        from: "+13343669616",
        to: toNumber
    });
};

module.exports = {
    sendSMS,
};

