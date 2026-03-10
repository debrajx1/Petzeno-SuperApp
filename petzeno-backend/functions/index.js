const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

admin.initializeApp();

// Initialize the Gemini API
// Make sure to define 'gemini.api_key' in Firebase Environment Variables
// using: firebase functions:config:set gemini.api_key="YOUR_API_KEY"
const genAI = new GoogleGenerativeAI(functions.config().gemini ? functions.config().gemini.api_key : "MOCK_KEY");

const GEMINI_SYSTEM_PROMPT = `
You are the Petzeno AI Assistant, an empathetic and knowledgeable veterinary assistant. 
Your role is to help pet owners understand their pets' symptoms, offer general care advice (like diet and exercise), and recommend professional vet visits when symptoms warrant it. 
Always include a disclaimer that you are not a replacement for a professional vet.
Keep your answers brief and suited for a mobile chat interface.
`;

/**
 * Callable Firebase Function: askPetHealthAssistant
 * Accepts { question: string, context: object }
 * Returns { answer: string }
 */
exports.askPetHealthAssistant = functions.https.onCall(async (data, context) => {
  try {
    // Ensure the user is authenticated to use this feature (Optional based on rules)
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'You must be logged in to use the Petzeno AI Assistant.'
      );
    }

    const userQuestion = data.question;
    if (!userQuestion || typeof userQuestion !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The question field is required and must be a string.'
      );
    }

    // Initialize the Gemini model (using gemini-pro for text conversations)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Construct the prompt combining the system instructions and the user's question
    const fullPrompt = `${GEMINI_SYSTEM_PROMPT}\n\nUser Question: ${userQuestion}\nAI Response:`;

    // Generate response from Gemini API
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    return {
      answer: responseText
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Fallback response if API key is missing or quota exceeded
    return {
      answer: "I'm having trouble connecting to my database right now. If your pet is experiencing urgent symptoms, please use the SOS feature to find a 24/7 clinic immediately."
    };
  }
});
