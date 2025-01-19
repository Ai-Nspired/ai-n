import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

// Add feedback endpoint
app.post('/feedback', async (req, res) => {
  const { type, query, response } = req.body;
  
  // Here you can:
  // 1. Store feedback in a database
  // 2. Use it to improve your LLM responses
  // 3. Log it for analysis
  
  console.log(`Received ${type} feedback for query: ${query}`);
  console.log(`Response: ${response.slice(0, 100)}...`);
  
  res.json({ success: true });
});

// Rest of your existing server code...
[Previous server.js content remains the same]
