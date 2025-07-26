const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;
const dotenv = require('dotenv');
dotenv.config();

const ACCOUNT_SID = process.env.TWILIO_SID || 'YOUR_TWILIO_SID';
const AUTH_TOKEN = process.env.TWILIO_TOKEN || 'YOUR_TWILIO_TOKEN';
const FROM_NUMBER = process.env.TWILIO_FROM || '+1234567890';
const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

async function startOutboundCall(lead) {
  // For now, just log. Replace with real call logic.
  console.log('Would start outbound call to:', lead.phone, 'for', lead.name);
  // Example:
  // await client.calls.create({
  //   url: 'https://your-server.com/your-twiml-url',
  //   to: lead.phone,
  //   from: FROM_NUMBER,
  // });
}

async function handleInboundCall(body) {
  const twiml = new VoiceResponse();
  twiml.say('Hello! This is your assistant. Please wait while we connect you.');
  // Add more logic here for flow selection, etc.
  return twiml.toString();
}

module.exports = { startOutboundCall, handleInboundCall }; 