const { google } = require('googleapis');
const path = require('path');
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'service-account.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SHEET_ID = process.env.SHEET_ID || 'YOUR_SHEET_ID_HERE';
const RANGE = 'Sheet1!A:D'; // Adjust as needed

async function logCall({ name, phone, result, notes }) {
  const client = await auth.getClient();
  await sheets.spreadsheets.values.append({
    auth: client,
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[name, phone, result, notes, new Date().toISOString()]],
    },
  });
}

module.exports = { logCall }; 