import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 3000;
import fetch from 'node-fetch';

app.use(express.urlencoded({ extended: false })); // To parse URL-encoded bodies

// 🔽 Add this middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/check-rank', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Missing email parameter.');
  }

  const scriptURL = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptURL) {
    return res.status(500).send('Google Apps Script URL not configured.');
  }

  try {
    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email }),
    });

    if (!response.ok) {
      console.error(`Google Apps Script error: ${response.status} - ${await response.text()}`);
      return res.status(500).send('Failed to contact Google Apps Script.');
    }

    const result = await response.text();
    res.send(result);
  } catch (error) {
    console.error('Error calling Google Apps Script:', error);
    res.status(500).send('Internal server error.');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});