const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.VOICEFLOW_API_KEY || 'YOUR_VOICEFLOW_API_KEY';
const PROJECT_ID = process.env.VOICEFLOW_PROJECT_ID || 'YOUR_PROJECT_ID';
const BASE_URL = `https://general-runtime.voiceflow.com/state/${PROJECT_ID}/user`;

async function startConversation({ userId, state = {}, variables = {} }) {
  const url = `${BASE_URL}/${userId}/interact`;
  const body = {
    state,
    request: { type: 'launch' },
    config: { tts: true },
    variables,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Voiceflow API error: ${res.status}`);
  return res.json();
}

module.exports = { startConversation }; 