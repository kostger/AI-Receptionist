// server.js
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const path = require('path');
const { callDialogflow } = require('./dialogflow'); // Import the callDialogflow function
const { createEvent } = require('./calendar'); // Ensure this function is correctly implemented in calendar.js

// Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'service-account-key.json');
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
// Initialize the Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio webhook endpoint for incoming calls
app.post('/incoming-call', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    const gather = twiml.gather({
        input: 'speech',
        action: '/gather',
        method: 'POST',
        language: 'el-GR',
        timeout: 5
    });
    gather.say({ language: 'el-GR' }, 'Γειά σας! Πώς μπορώ να σας βοηθήσω;');
    res.type('text/xml');
    res.send(twiml.toString());
});

// Endpoint to handle gathered input
app.post('/gather', async (req, res) => {
    const speechResult = req.body.SpeechResult;
    console.log(`Speech result: ${speechResult}`);

    const twiml = new twilio.twiml.VoiceResponse();

    if (speechResult) {
        try {
            const dialogflowResponse = await callDialogflow(speechResult);
            const intentName = dialogflowResponse.intent.displayName;
            const fulfillmentText = dialogflowResponse.fulfillmentText;
            const parameters = dialogflowResponse.parameters.fields;

            if (intentName === 'Report Symptoms') {
                const symptom = parameters.symptom.stringValue;
                twiml.say({ language: 'el-GR', voice: 'Google.el-GR-Standard-A' }, `Καταλαβαίνω ότι έχετε ${symptom}. Θα θέλατε να κλείσετε ραντεβού;`);
                twiml.gather({
                    input: 'speech',
                    action: '/schedule-appointment',
                    method: 'POST',
                    language: 'el-GR',
                    timeout: 5
                });
            } else {
                twiml.say({ language: 'el-GR', voice: 'Google.el-GR-Standard-A' }, fulfillmentText);
                twiml.redirect('/incoming-call');
            }

            res.type('text/xml');
            res.send(twiml.toString());
        } catch (error) {
            console.error('Error calling Dialogflow:', error);
            twiml.say({ language: 'el-GR', voice: 'Google.el-GR-Standard-A' }, 'Συγγνώμη, υπήρξε πρόβλημα με την επεξεργασία του αιτήματός σας.');
            twiml.redirect('/incoming-call');
            res.type('text/xml');
            res.send(twiml.toString());
        }
    } else {
        twiml.say({ language: 'el-GR', voice: 'Google.el-GR-Standard-A' }, 'Συγγνώμη, δεν κατάλαβα. Μπορείτε να επαναλάβετε;');
        twiml.redirect('/incoming-call');
        res.type('text/xml');
        res.send(twiml.toString());
    }
});

// Endpoint to handle scheduling appointment
app.post('/schedule-appointment', async (req, res) => {
    const speechResult = req.body.SpeechResult;
    console.log(`Schedule appointment speech result: ${speechResult}`);

    const twiml = new twilio.twiml.VoiceResponse();

    if (speechResult) {
        try {
            const dialogflowResponse = await callDialogflow(speechResult);
            const intentName = dialogflowResponse.intent.displayName;
            const parameters = dialogflowResponse.parameters.fields;

            if (intentName === 'Schedule Appointment') {
                const date = parameters.date.stringValue;
                const time = parameters.time.stringValue;

                const event = {
                    summary: 'Doctor Appointment',
                    start: {
                        dateTime: new Date(`${date}T${time}`).toISOString(),
                        timeZone: 'Europe/Athens',
                    },
                    end: {
                        dateTime: new Date(`${date}T${time}`).toISOString(),
                        timeZone: 'Europe/Athens',
                    },
                };

                try {
                    await createEvent(event);
                    twiml.say({ language: 'el-GR', voice: 'Google.el-GR-Standard-A' }, `Το ραντεβού σας έχει προγραμματιστεί για ${date} στις ${time}.`);
                } catch (error) {
                    console.error('Error creating calendar event:', error);
                    twiml.say({ language: 'el-GR', voice: 'Google.el-GR-Standard-A' }, 'Συγγνώμη, υπήρξε πρόβλημα με τον προγραμματισμό του ραντεβού σας.');
                }
            } else {
                twiml.say({ language: 'el-GR', voice: 'Google.el-GR-Standard-A' }, 'Συγγνώμη, δεν κατάλαβα. Μπορείτε να επαναλάβετε;');
                twiml.redirect('/incoming-call');
            }

            res.type('text/xml');
            res.send(twiml.toString());
        } catch (error) {
            console.error('Error calling Dialogflow:', error);
            twiml.say({ language: 'el-GR', voice: 'Google.el-GR-Standard-A' }, 'Συγγνώμη, υπήρξε πρόβλημα με την επεξεργασία του αιτήματός σας.');
            twiml.redirect('/incoming-call');
            res.type('text/xml');
            res.send(twiml.toString());
        }
    } else {
        twiml.say({ language: 'el-GR', voice: 'Google.el-GR-Standard-A' }, 'Συγγνώμη, δεν κατάλαβα. Μπορείτε να επαναλάβετε;');
        twiml.redirect('/incoming-call');
        res.type('text/xml');
        res.send(twiml.toString());
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
