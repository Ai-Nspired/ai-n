import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Add chat completion endpoint
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "perplexity/llama-3.1-sonar-small-128k-online",
      messages: [
        {
          role: "user",
          content: userMessage
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from Perplexity API:', error);
    res.status(500).json({ error: 'Failed to fetch response from Perplexity API' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
