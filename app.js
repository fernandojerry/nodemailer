const express = require('express');
var cors = require('cors')
const { sendEmail } = require('./mail');

const app = express();

const helmet = require('helmet')
app.use(helmet({
	crossOriginEmbedderPolicy: process.env.NODE_ENV !== 'production'
}));

const whitelist = process.env.FRONTEND_APP_URLS.split(',');
const corsOptions = {
	origin: function (origin, callback) {
		if (!origin) { // TODO: clients suach as postman req with no origin
			return callback(null, true);
		}

		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}

app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (_, res) => {
	return res.send('Silence is golden')
});

app.post('/send-email', (req, res) => {
	const { email, subject, message } = req.body;

	// basic validation
	if (
		!email || !email.trim() ||
		!subject || !subject.trim() ||
		!message || !message.trim()
	) {
		return res.status(400).json({ message: 'name, email, subject and message are required' });
	}

	const receipients = `<${email}>`;

	res.json({ message: 'Sending email in a moment...' });

	sendEmail({ receipients, subject, message })
		.then(result => {console.log('message sent') })
		.catch(error => {
			console.log(error.message)
		});
});

module.exports = app;
