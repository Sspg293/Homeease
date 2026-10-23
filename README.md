# HomeEase with real SMS OTP
1. Create a Twilio account, then a Verify service (Console > Verify > Services). Copy Account SID, Auth Token, Verify Service SID.
2. Copy `.env.example` to `.env` and fill in the three values.
3. `npm install` then `npm start`, open http://localhost:3000
Notes: a Twilio trial account only texts numbers you have verified in the console. For production in India, SMS needs DLT registration; MSG91 or Fast2SMS are common alternatives (replace the two calls in server.js).
