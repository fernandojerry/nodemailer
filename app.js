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
    const { email, subject, message } = req.body;

    // Basic validation
    if (!email || !subject || !message) {
        return res.status(400).json({ message: 'Email, subject, and message are required' });
    }

    const receipients = `<${email}>`;

    sendEmail({ receipients, subject, message })
        .then(result => {
            console.log('Email sent:', result);
            res.status(200).json({ message: 'Email sent successfully' });
        })
        .catch(error => {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Failed to send email' });
        });
});

module.exports = app;
