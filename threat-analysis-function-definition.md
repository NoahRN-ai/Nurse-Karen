# Google Cloud Function: threat-analysis-function

This document outlines the specifications for the Google Cloud Function responsible for sentiment analysis of user messages.

**File Name (Conceptual for Cloud Function):** `index.js`
**Runtime:** Node.js (e.g., Node.js 18 or later)

## Dependencies (`package.json`)

```json
{
  "name": "threat-analysis-function",
  "version": "1.0.0",
  "dependencies": {
    "@google-cloud/language": "^6.0.0",
    "@google-cloud/vertexai": "^0.4.0",
    "express": "^4.17.1"
  },
  "main": "index.js",
  "scripts": {
    "start": "functions-framework --target=threatAnalysisFunction"
  }
}
```
*(Note: `functions-framework` would be a dev dependency for local testing)*

## Function Definition: `threatAnalysisFunction`

**Trigger:** HTTP Trigger (Accepts POST requests)

**Core Logic:**

1.  **Request Handling:**
    *   Accepts JSON POST requests.
    *   Expects a request body format: `{"message": "User's text here"}`.
    *   Input Validation:
        *   Ensures the `message` field exists.
        *   Ensures `message` is a non-empty string.
        *   Returns HTTP 400 (Bad Request) if validation fails.
    *   Handles HTTP OPTIONS method for CORS preflight requests.
    *   Returns HTTP 405 (Method Not Allowed) for non-POST requests.

2.  **Sentiment Analysis (Google Cloud Natural Language API):**
    *   Initializes the `LanguageServiceClient` from `@google-cloud/language`.
    *   Constructs a `document` object suitable for the API:
        ```javascript
        const document = {
          content: userMessage,
          type: 'PLAIN_TEXT',
        };
        ```
    *   Calls `languageClient.analyzeSentiment({document: document})` to get sentiment score and magnitude.

3.  **Response Preparation (for initial integration):**
    *   **Important for Task 6/7 Iteration:** This initial version focuses *only* on returning the sentiment. The Vertex AI integration for "LOGGED FOR REVIEW" prefixing based on sentiment score is planned for a subsequent task (Task 7 in the overall project plan, though the prompt mentions Task 6 here for the function's output scope).
    *   Returns a JSON response with:
        ```json
        {
          "sentimentScore": 0.5, // Example value
          "sentimentMagnitude": 0.8, // Example value
          "originalMessage": "User's text here"
        }
        ```
    *   Error Handling: Logs errors from the Language API call and returns an HTTP 500 (Internal Server Error).

## Conceptual Code Structure (`index.js`)

```javascript
const functions = require('@google-cloud/functions-framework');
const {LanguageServiceClient} = require('@google-cloud/language').v1; // Or v2 if preferred

// Instantiates a client for the Language service
const languageClient = new LanguageServiceClient();

functions.http('threatAnalysisFunction', async (req, res) => {
  // Set CORS headers to allow requests from the web app's origin
  // For development, '*' is permissive. For production, restrict this.
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Ensure the request is a POST request
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Validate the request body
  if (!req.body || typeof req.body.message !== 'string' || req.body.message.trim() === '') {
    res.status(400).send('Bad Request: Missing or invalid "message" field in JSON payload. Ensure "Content-Type" is "application/json".');
    return;
  }

  const userMessage = req.body.message;

  try {
    const document = {
      content: userMessage,
      type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const [result] = await languageClient.analyzeSentiment({document: document});
    const sentiment = result.documentSentiment;

    // Log the sentiment analysis details (optional, good for debugging)
    console.log(`Sentiment analysis performed for: "${userMessage}"`);
    if (sentiment) {
      console.log(`  Score: ${sentiment.score}`);
      console.log(`  Magnitude: ${sentiment.magnitude}`);
    } else {
      console.log('  No sentiment data returned.');
    }


    // Send the sentiment score and original message in the response
    res.status(200).json({
      sentimentScore: sentiment ? sentiment.score : 0, // Default to 0 if no sentiment
      sentimentMagnitude: sentiment ? sentiment.magnitude : 0, // Default to 0
      originalMessage: userMessage
    });

  } catch (error) {
    console.error('ERROR analyzing sentiment:', error);
    // Send a generic error response
    res.status(500).send('Internal Server Error while analyzing sentiment.');
  }
});
```

## Environment Variables (Conceptual for Cloud Function Environment)

*   `GOOGLE_APPLICATION_CREDENTIALS`: (Usually managed automatically by the Cloud Functions environment if the service account has the correct permissions). For local development with `functions-framework`, this would point to a service account key JSON file with "Cloud Natural Language API User" and potentially "Vertex AI User" roles.
*   Other variables (e.g., Project ID) are typically available via the runtime environment.

## Permissions (Service Account for the Cloud Function)

The service account used by this Cloud Function will need the following IAM roles:
*   **Cloud Natural Language API User:** To call `analyzeSentiment`.
*   **(Later for Task 7) Vertex AI User:** To interact with Vertex AI models.
*   **Cloud Functions Invoker:** (If restricting who can call the function, though for this project, it's likely public or authenticated via API Gateway).

This definition provides the blueprint for the `threat-analysis-function`.
