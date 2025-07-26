# VF Voice Outbound (Minimal Backend)

## Features
- Outbound call automation (Make.com → Twilio)
- Inbound call handling (Twilio webhook)
- Google Sheets logging (call results)
- Manual flow selection menu (for testing)

## Setup
1. `cd vf-voice-outbound`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your values
4. Place your Google service account JSON as `service-account.json` in this folder

## Environment Variables
See `.env.example` for required variables:
- `SHEET_ID`: Your Google Sheet ID
- `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_FROM`: Twilio credentials/number
- `PORT`: (optional) Server port

## Usage
- Start server: `npm start`
- Make.com: POST to `/webhook/make` with lead info to trigger outbound call
- Twilio: Set webhook to `/webhook/twilio` for inbound calls
- Log call: POST to `/log` with `{ name, phone, result, notes }`
- Manual: Open `/manual` in browser to test flows

## Google Sheets Setup
- Create a Google Sheet with columns: Name, Phone, Result, Notes
- Share with your service account email

## Twilio Setup
- Buy a phone number
- Set webhook to your server's `/webhook/twilio` endpoint

## Voiceflow API Integration
- Add your Voiceflow API key and project ID to `.env`.
- Use `/voiceflow/start` endpoint to trigger a Voiceflow conversation via API.
- Example:
  - POST `/voiceflow/start` with `{ "userId": "123", "variables": { "name": "Alice" } }` and header `x-api-key: your_api_key`.

## Authentication
- All endpoints (except `/manual`) require an API key.
- Set `API_KEY` in your `.env`.
- Pass `x-api-key` header with your requests.

## Docker Support
- Build: `docker build -t vf-voice-outbound .`
- Run: `docker run --env-file .env -p 3000:3000 vf-voice-outbound`
- Or use Docker Compose: `docker-compose up`

---
This is a minimal starter. Expand flows and logic as needed!
