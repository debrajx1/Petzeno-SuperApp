const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
// This will throw if the API key is not in process.env
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (e) {
  console.warn("Gemini API Key missing! Chatbot will fail until provided.");
}

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!genAI) {
        return res.status(500).json({ error: 'Gemini API not configured on server.' });
    }

    // Convert frontend messages to Gemini format.
    // Gemini REQUIRES strictly alternating roles: user, model, user, model...
    // We must rebuild the history carefully.
    const validMessages = messages.filter(msg => msg.text && msg.text.trim().length > 0);
    
    const formattedHistory = [];
    for (const msg of validMessages) {
      const role = msg.sender === 'user' ? 'user' : 'model';
      
      if (formattedHistory.length === 0) {
        if (role === 'model') continue; // First message MUST be from user
        formattedHistory.push({ role, parts: [{ text: msg.text }] });
      } else {
        const lastMsg = formattedHistory[formattedHistory.length - 1];
        if (lastMsg.role === role) {
          // Collapse consecutive messages from the same role
          lastMsg.parts[0].text += '\n\n' + msg.text;
        } else {
          formattedHistory.push({ role, parts: [{ text: msg.text }] });
        }
      }
    }

    if (formattedHistory.length === 0 || formattedHistory[formattedHistory.length - 1].role !== 'user') {
      return res.status(400).json({ error: 'History must end with a user message' });
    }

    // The last message is the current prompt, we pop it off
    const currentPrompt = formattedHistory.pop();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "You are the Petzeno AI Health Assistant. You give helpful advice to pet owners about symptoms, diet, and care. Keep answers concise, friendly, and always remind them to consult a real vet for serious issues."
    });
    
    const chat = model.startChat({
        history: formattedHistory,
    });

    const result = await chat.sendMessage(currentPrompt.parts[0].text);
    const responseText = result.response.text();

    res.json({ text: responseText, role: 'assistant' });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

module.exports = router;
