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

    // 1. Clean and Filter messages (Ensure alternating roles)
    const formattedHistory = [];
    messages.filter(msg => msg.text?.trim()).forEach((msg) => {
      const role = msg.sender === 'user' ? 'user' : 'model';
      if (formattedHistory.length === 0) {
        if (role === 'user') formattedHistory.push({ role, parts: [{ text: msg.text }] });
      } else {
        const last = formattedHistory[formattedHistory.length - 1];
        if (last.role === role) {
          last.parts[0].text += "\n\n" + msg.text;
        } else {
          formattedHistory.push({ role, parts: [{ text: msg.text }] });
        }
      }
    });

    if (formattedHistory.length === 0) {
      return res.status(400).json({ error: 'No valid user messages found.' });
    }

    const lastMessage = formattedHistory.pop();
    if (lastMessage.role !== 'user') {
      return res.status(400).json({ error: 'Last message must be from user.' });
    }

    // 2. Configure Model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are the Petzeno AI Health Assistant. You give helpful advice to pet owners about symptoms, diet, and care. Keep answers concise, premium, and friendly. Always remind them to consult a real vet for serious issues."
    });

    // 3. Start Chat & Send Message
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
      safetySettings: [
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
      ]
    });

    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const responseText = result.response.text();

    res.json({ text: responseText, role: 'assistant' });
  } catch (error) {
    console.error('--- Gemini Error ---');
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    res.status(500).json({ 
      error: 'AI failed to respond.', 
      details: error.message 
    });
  }
});

module.exports = router;
