const { GoogleAuth } = require('google-auth-library');
const path = require('path');

async function getAccessToken() {
  const keyFilePath = path.join(__dirname, 'service-account.json');

  const auth = new GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const client = await auth.getClient();
  const accessTokenResponse = await client.getAccessToken();
  return accessTokenResponse.token;
}

module.exports = { getAccessToken };