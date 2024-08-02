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

const sendEmail = async ({ receipients, subject, htmlContent, plainText }) => {
    return await transport.sendMail({
        from: `"Hillview" <admin@hillviewhousing.com>`,
        to: receipients,
        subject,
        text: plainText,
        html: htmlContent,
        headers: {
            'Reply-To': 'admin@hillviewhousing.com',
            'List-Unsubscribe': '<mailto:unsubscribe@hillviewhousing.com>',
            'X-Mailer': 'Nodemailer',
            'X-Priority': '3',  // 1 (High), 3 (Normal), 5 (Low)
            'X-MSMail-Priority': 'Normal',
            'Importance': 'Normal'
        }
    });
};

module.exports = { sendEmail };
