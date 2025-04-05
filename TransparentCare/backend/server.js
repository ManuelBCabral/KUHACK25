// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const tesseract = require('node-tesseract-ocr');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Handle large base64 images

// POST /analyze
app.post('/analyze', async (req, res) => {
  try {
    const { base64Image } = req.body;
    if (!base64Image) {
      return res.status(400).json({ error: 'No base64Image provided' });
    }

    // 1) Strip any "data:image/..." prefix
    const cleanedBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // 2) Convert base64 -> Buffer
    const imgBuffer = Buffer.from(cleanedBase64, 'base64');

    // 3) Preprocess with Sharp: grayscale + threshold
    const processedBuffer = await sharp(imgBuffer)
      .greyscale()     
      .threshold(128)
      // .rotate()      // If the receipt is tilted, you can rotate by a fixed angle
      // .resize(...)   // Optionally resize if the original is huge
      .toBuffer();

    // 4) Save the processed image as a temporary file for Tesseract
    const tempFilePath = path.join(__dirname, 'temp_processed.jpg');
    fs.writeFileSync(tempFilePath, processedBuffer);

    // 5) Tesseract config
    const config = {
      lang: 'eng', 
      oem: 1,       // LSTM engine only
      psm: 6        // Assume a single uniform block of text (often good for receipts)
    };

    // 6) OCR with Tesseract
    const text = await tesseract.recognize(tempFilePath, config);
    console.log('[Tesseract OCR] Extracted text:\n', text);

    // (Optional) Clean up the temp file
    fs.unlinkSync(tempFilePath);

    // 7) Return recognized text
    res.json({ text: text.trim() });

  } catch (error) {
    console.error('[Tesseract OCR] Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[Express] OCR server running on port ${PORT}`);
});