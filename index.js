const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const googleSheets = require('./googleSheets');
const twilio = require('./twilio');
const voiceflow = require('./voiceflow');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// API key auth middleware
const API_KEY = process.env.API_KEY || 'changeme';
function requireApiKey(req, res, next) {
  if (['/manual', '/manual/flow'].includes(req.path)) return next();
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) return res.status(401).send({ error: 'Unauthorized' });
  next();
}
app.use(requireApiKey);

// 1. Make.com triggers outbound call
app.post('/webhook/make', async (req, res) => {
  const lead = req.body;
  try {
    await twilio.startOutboundCall(lead);
    res.status(200).send({ success: true });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// 2. Twilio webhook for inbound call
app.post('/webhook/twilio', async (req, res) => {
  try {
    const twiml = await twilio.handleInboundCall(req.body);
    res.type('text/xml').send(twiml);
  } catch (e) {
    res.status(500).send('<Response><Say>Sorry, error occurred.</Say></Response>');
  }
});

// 3. Log call results to Google Sheets
app.post('/log', async (req, res) => {
  const { name, phone, result, notes } = req.body;
  try {
    await googleSheets.logCall({ name, phone, result, notes });
    res.status(200).send({ success: true });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// 4. Manual menu for flow selection
app.get('/manual', (req, res) => {
  res.send(`
    <h1>Manual Flow Selection</h1>
    <ul>
      <li><a href="/manual/flow?type=sales">Outbound Sales Agent</a></li>
      <li><a href="/manual/flow?type=executive">Executive Assistant</a></li>
      <li><a href="/manual/flow?type=admin">Admin Follow-Up</a></li>
    </ul>
  `);
});

// Manual flow trigger (stub)
app.get('/manual/flow', async (req, res) => {
  const { type } = req.query;
  // Here you would trigger the selected flow logic
  res.send(`<h2>Triggered flow: ${type}</h2>`);
});

// Add Voiceflow API trigger endpoint
app.post('/voiceflow/start', async (req, res) => {
  try {
    const { userId, state, variables } = req.body;
    const result = await voiceflow.startConversation({ userId, state, variables });
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
