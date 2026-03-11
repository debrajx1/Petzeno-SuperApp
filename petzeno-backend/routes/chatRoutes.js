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

    // Convert frontend messages to Gemini format
    const formattedHistory = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // The last message is the current prompt, we pop it off
    const currentPrompt = formattedHistory.pop();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
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
