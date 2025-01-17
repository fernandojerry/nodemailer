const express = require('express');
const cors = require('cors');
const { sendEmail } = require('./mail');
const helmet = require('helmet');

const app = express();

app.use(helmet({
    crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production'
}));

const whitelist = process.env.FRONTEND_APP_URLS.split(',');
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            return callback(null, true); // Allow non-origin requests (e.g., Postman)
        }
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (_, res) => {
    return res.send('Silence is golden');
});

app.post('/send-email', (req, res) => {
    const { email, subject, htmlContent, plainText } = req.body;

    // Basic validation
    if (!email || !subject || !htmlContent || !plainText) {
        return res.status(400).json({plainText: 'Email, subject, and message are required' });
    }

    const receipients = `<${email}>`;

    sendEmail({ receipients, subject, htmlContent, plainText })
        .then(result => {
            console.log('Email sent:', result);
            res.status(200).json({plainText: 'Email sent successfully' });
        })
        .catch(error => {
            console.error('Error sending email:', error);
            res.status(500).json({ plainText: 'Failed to send email' });
        });
});

module.exports = app;
