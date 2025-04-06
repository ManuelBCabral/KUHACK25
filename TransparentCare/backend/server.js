// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Variable to store extracted text
let hardcodedBillText = '';

app.post('/analyze', async (req, res) => {
  try {
    const base64Image = req.body.base64Image;
    if (!base64Image) {
      return res.status(400).json({ error: 'Missing base64Image field' });
    }

    console.log('[🧠 GPT-Vision] base64 size:', base64Image.length);

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-2024-04-09',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
            {
              type: 'text',
              text: `Extract all visible and readable text from the image.`,
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const extractedText = response.choices?.[0]?.message?.content || 'No result returned';

    // Store result in the server variable
    hardcodedBillText = extractedText;
    console.log('[📄 Stored in hardcodedBillText]:\n', hardcodedBillText);

    // Respond with generic "ok"
    res.json({ status: 'ok' });

  } catch (err) {
    console.error('[❌ GPT-4 Vision Error]', err?.status || '', err?.message || err);
    res.status(500).json({ error: 'Failed to process image with GPT-4 Vision' });
  }
});

// Optional: Route to check stored bill text
app.get('/billtext', (req, res) => {
  res.json({ hardcodedBillText });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[Express] GPT-4 Vision server running on port ${PORT}`);
});