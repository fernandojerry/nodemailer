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
        headers: {
            'Reply-To': 'support@hillviewhousing.com',
            'List-Unsubscribe': '<mailto:unsubscribe@hillviewhousing.com>',
            'X-Mailer': 'Nodemailer',
            'X-Priority': '3',  // 1 (High), 3 (Normal), 5 (Low)
            'X-MSMail-Priority': 'Normal',
            'Importance': 'Normal'
        }
    });
};

module.exports = { sendEmail };
