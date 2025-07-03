const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/ai/ask
router.post('/ask', async (req, res) => {
  const { prompt, model = 'togethercomputer/llama-2-70b-chat' } = req.body;
  if (!prompt) return res.status(400).json({ message: 'Prompt is required' });
  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/completions',
      {
        model,
        prompt,
        max_tokens: 512,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error('AI API error:', err.response?.data || err.message);
    res.status(500).json({ message: 'AI API error', error: err.response?.data || err.message });
  }
});

module.exports = router;
