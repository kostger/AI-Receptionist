// calendar.js
const fs = require('fs');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

// Load client secrets from a local file
let credentials;
try {
    credentials = JSON.parse(fs.readFileSync('credentials.json'));
} catch (err) {
    console.error('Error loading credentials.json:', err);
    process.exit(1);
}

if (!credentials.web) {
    console.error('credentials.json is missing the "web" key');
    process.exit(1);
}

// Create an OAuth2 client with the given credentials
const oAuth2Client = new OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
);

// Generate an OAuth2 URL to get the authorization code
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function getAuthUrl() {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
}

// Get and store the access token
function getAccessToken(code) {
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFileSync('token.json', JSON.stringify(token));
        console.log('Token stored to', 'token.json');
    });
}

// Load token from disk if it exists, else get a new one
if (fs.existsSync('token.json')) {
    const token = JSON.parse(fs.readFileSync('token.json'));
    oAuth2Client.setCredentials(token);
} else {
    getAuthUrl();
}

// Export the authenticated OAuth2 client
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

async function listEvents() {
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });
    const events = res.data.items;
    if (events.length) {
        console.log('Upcoming events:');
        events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
        });
    } else {
        console.log('No upcoming events found.');
    }
}

async function createEvent(event) {
    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });
        console.log('Event created: %s', response.data.htmlLink);
    } catch (error) {
        console.error('Error creating event:', error);
    }
}

module.exports = { listEvents, createEvent };
