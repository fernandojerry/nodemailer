const nodemailer = require('nodemailer');
require('dotenv').config();

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD  // Corrected key to 'pass'
    },
});

const sendEmail = async ({ receipients, subject, message }) => {
    return await transport.sendMail({
        from: `"Hillview" <support@hillviewhousing.com>`,
        to: receipients,
        subject,
        text: message,
        html: message,
    });
};

module.exports = { sendEmail };
