require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const verify = client.verify.v2.services(process.env.TWILIO_VERIFY_SID);
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 10 });
const validPhone = (p) => /^[6-9]\d{9}$/.test(p || '');

app.post('/api/send-otp', limiter, async (req, res) => {
  const { phone } = req.body || {};
  if (!validPhone(phone)) return res.status(400).json({ ok: false, error: 'Invalid mobile number.' });
  try {
    await verify.verifications.create({ to: '+91' + phone, channel: 'sms' });
    res.json({ ok: true });
  } catch (e) {
    console.error('send-otp:', e.message);
    res.status(500).json({ ok: false, error: 'Could not send OTP. Try again later.' });
  }
});

app.post('/api/verify-otp', limiter, async (req, res) => {
  const { phone, code } = req.body || {};
  if (!validPhone(phone) || !/^\d{4,8}$/.test(code || '')) return res.status(400).json({ ok: false, error: 'Invalid request.' });
  try {
    const r = await verify.verificationChecks.create({ to: '+91' + phone, code });
    res.json(r.status === 'approved' ? { ok: true } : { ok: false, error: 'Incorrect code. Try again.' });
  } catch (e) {
    res.status(400).json({ ok: false, error: 'Code expired or incorrect. Request a new one.' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('HomeEase running on http://localhost:' + (process.env.PORT || 3000)));
