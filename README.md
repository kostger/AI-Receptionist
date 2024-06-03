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

## Obtaining Tokens and Keys

### Google Cloud Service Account Key

1. **Create a Project in Google Cloud Console**:
    - Go to the [Google Cloud Console](https://console.cloud.google.com/).
    - Click on the project drop-down and select or create a new project.

2. **Enable the Dialogflow and Google Calendar APIs**:
    - In the Google Cloud Console, navigate to **APIs & Services** > **Library**.
    - Search for "Dialogflow" and "Google Calendar" and enable both APIs.

3. **Create a Service Account**:
    - Go to **IAM & Admin** > **Service Accounts**.
    - Click **+ CREATE SERVICE ACCOUNT**.
    - Provide a name and description for the service account.
    - Click **Create and Continue**.
    - Assign the role **Dialogflow API Client** and **Google Calendar API** to the service account.
    - Click **Done**.

4. **Generate a Key File**:
    - Find your newly created service account in the list and click on it.
    - Go to the **Keys** tab.
    - Click **Add Key** > **Create New Key**.
    - Select **JSON** and click **Create**.
    - Download the key file and save it securely. This file will be used to authenticate API requests.

### Twilio Credentials

1. **Create a Twilio Account**:
    - Sign up for a Twilio account at [Twilio](https://www.twilio.com/).

2. **Get Your Twilio Account SID and Auth Token**:
    - After logging in, go to the [Twilio Console](https://www.twilio.com/console).
    - Your **Account SID** and **Auth Token** are displayed on the dashboard. Note them down.

3. **Buy a Twilio Phone Number**:
    - In the Twilio Console, go to **Phone Numbers** > **Buy a Number**.
    - Purchase a phone number that you will use for the AI receptionist.

4. **Configure Twilio Webhook**:
    - Go to **Phone Numbers** > **Manage** > **Active Numbers**.
    - Click on your phone number.
    - Under **Voice & Fax**, set the **A Call Comes In** webhook to your Ngrok URL followed by `/incoming-call`.

### Setting Up Environment Variables

1. **Google Cloud Service Account Key**:
    - Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point to the path of your service account key file:
    ```bash
    export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account-file.json"
    ```

2. **Twilio Credentials**:
    - Set the `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` environment variables to your Twilio credentials:
    ```bash
    export TWILIO_ACCOUNT_SID="your_twilio_account_sid"
    export TWILIO_AUTH_TOKEN="your_twilio_auth_token"
    ```

You can set these environment variables in your development environment or include them in a `.env` file if you are using a library like `dotenv` to manage environment variables in your Node.js application.


