async function analyzeReceipt(base64Image) {
  const accessToken = await getAccessToken();
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';
  
  const payload = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Extract all text from this medical receipt, including a breakdown of items and prices.",
          },
        ],
      },
    ],
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  console.log("Gemini raw response:", result);
  
  return result?.candidates?.[0]?.content?.parts?.[0]?.text || 'No result returned.';
}

module.exports = { analyzeReceipt };