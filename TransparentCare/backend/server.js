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

    // Remove any data prefix, e.g. "data:image/jpeg;base64,"
    const cleanedBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // Convert base64 -> Buffer
    const imgBuffer = Buffer.from(cleanedBase64, 'base64');

    // Preprocessing with Sharp:
    // 1) Resize up to 2000 px wide for better OCR if the original is small.
    // 2) (Optionally) rotate if you suspect the receipt is tilted.
    // 3) Convert to grayscale & threshold to boost contrast.
    const processedBuffer = await sharp(imgBuffer)
      // .rotate(2)           // Uncomment & change angle if the receipt is tilted by ~2 degrees
      .resize({ width: 2000, withoutEnlargement: false })
      .greyscale()
      .threshold(128)
      .toBuffer();

    // Write processed image to temp file
    const tempFilePath = path.join(__dirname, 'temp_processed.jpg');
    fs.writeFileSync(tempFilePath, processedBuffer);

    // Tesseract configuration:
    // OEM=3 means "use any available engine" (legacy + LSTM if installed).
    // PSM=3 is "Fully automatic page segmentation" which can be good for multi-line text.
    // Try PSM=6 or 7 if text is single-column or single-line.
    const config = {
      lang: 'eng',  // for English; install additional languages if needed
      oem: 3,       // 3 = default, tries legacy + LSTM
      psm: 3        // 3 = fully automatic, or try 6 = uniform block, 7 = single text line
    };

    // OCR with Tesseract
    const text = await tesseract.recognize(tempFilePath, config);
    console.log('[Tesseract OCR] Extracted text:\n', text);

    // Remove the temp file
    fs.unlinkSync(tempFilePath);

    // Return recognized text
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