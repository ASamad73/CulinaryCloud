const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const ChatMessage = require('../models/ChatMsgs');

const router = express.Router();

// POST /api/chat/ask - Send a message and get a response
router.post('/ask', auth, async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const { question } = req.body;

  try {
    // Retrieve recent messages (last 10) for context
    const recentMessages = await ChatMessage.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('from text');

    // Format conversation history
    const history = recentMessages.reverse().map(msg => `${msg.from}: ${msg.text}`).join('\n');

    const systemPrompt = 'You are a friendly, expert cooking assistant. You MUST answer only questions about recipes, ingredients, cooking techniques, meal planning, and food science. If the user asks something outside cooking, except for any greetings, politely say “I’m sorry, I only help with cooking-related questions"';
    const prompt = `${systemPrompt}\n\nPrevious conversation:\n${history}\n\nQuestion: ${question}`;

    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

    // Save user message
    const userMessage = new ChatMessage({
      userId,
      from: 'user',
      text: question,
    });
    await userMessage.save();

    // Save bot response
    const botMessage = new ChatMessage({
      userId,
      from: 'bot',
      text: reply,
    });
    await botMessage.save();

    res.json({ answer: reply });
  } catch (error) {
    console.error("Error from Gemini API:", error.message);
    res.status(500).json({ error: "Failed to fetch from Gemini." });
  }
});

// GET /api/chat/history - Retrieve conversation history
router.get('/history', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const messages = await ChatMessage.find({ userId })
      .sort({ timestamp: 1 })
      .select('from text');
    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history." });
  }
});

module.exports = router;