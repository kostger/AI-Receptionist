# AI Receptionist for Doctor's Office

This project implements an AI-based receptionist for a doctor's office using various modern technologies. The system can handle incoming calls, understand and process natural language to schedule appointments, and manage the doctor's calendar.

## Features

- **Natural Language Understanding**: Uses Dialogflow to understand and process spoken language.
- **Telephony Integration**: Integrates with Twilio to handle incoming phone calls.
- **Calendar Management**: Uses Google Calendar API to schedule and manage appointments.
- **Language Support**: Supports Greek language for both speech recognition and responses.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime to build the backend of the application.
- **Express.js**: Web framework for Node.js to handle HTTP requests and responses.
- **Dialogflow**: Natural language understanding tool to process and understand user inputs.
- **Twilio**: Cloud communications platform to manage incoming and outgoing phone calls.
- **Google Calendar API**: API to create, update, and manage calendar events.
- **Ngrok**: Tool to expose the local server to the internet for webhook testing.

## Setup Instructions

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/ai-receptionist.git
    cd ai-receptionist
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Configure Environment Variables**:
    - Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point to your Google Cloud service account key file.
    - Set up Twilio credentials for handling incoming calls.

4. **Run the Server**:
    ```bash
    node server.js
    ```

5. **Expose Local Server**:
    - Use Ngrok to expose your local server to the internet:
    ```bash
    ngrok http 3000
    ```

6. **Configure Twilio Webhooks**:
    - Update your Twilio number to point to the Ngrok URL followed by `/incoming-call`.

## Project Structure

- `server.js`: Main server file handling incoming HTTP requests and integrating with Dialogflow and Twilio.
- `dialogflow.js`: Module to interact with Dialogflow for natural language processing.
- `calendar.js`: Module to interact with Google Calendar API to manage appointments.
- `credentials.json`: Contains service account credentials for Google Cloud (not included, should be obtained separately).

