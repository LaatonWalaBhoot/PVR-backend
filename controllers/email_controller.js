const sgMail = require('@sendgrid/mail');
const config = require('config');

async function sendEmail(body) {
    sgMail.setApiKey(config.get('email_key').toString());
    const msg = {
        to: body[0],
        from: body[1],
        subject: body[2],
        text: body[3],
    };
    sgMail.send(msg)
        .then((result) => console.log(result))
        .catch(err => console.log(err))
}

module.exports = sendEmail;