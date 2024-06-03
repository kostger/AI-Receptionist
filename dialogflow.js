// dialogflow.js
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

// Create a session client
const sessionClient = new dialogflow.SessionsClient();

// Function to call Dialogflow
async function callDialogflow(queryText) {
    const projectId = 'ai-receptionist-jelf'; // Replace with your Dialogflow project ID
    const sessionId = uuid.v4();

    // Define session path
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    // The text query request
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText,
                languageCode: 'el', // Set language code to Greek
            },
        },
    };

    try {
        // Send request and get response from Dialogflow
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        return result;
    } catch (error) {
        console.error('ERROR:', error);
        throw error;
    }
}

module.exports = { callDialogflow };
