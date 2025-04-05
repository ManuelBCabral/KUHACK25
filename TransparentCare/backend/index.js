const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { analyzeReceipt } = require('./gemini');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/analyze', async (req, res) => {
  const { base64Image } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: 'Missing base64Image in request.' });
  }

  try {
    const result = await analyzeReceipt(base64Image);
    return res.json({ text: result });
  } catch (error) {
    console.error('Error analyzing receipt:', error.message);
    return res.status(500).json({ error: 'Failed to process image.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));