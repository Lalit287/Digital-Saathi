# Debugging Gemini Integration

## Quick Troubleshooting Steps

### 1. Verify API Key is Loaded

Check your backend console when starting. You should see:
```
✅ Gemini AI initialized successfully with model: gemini-2.5-flash
API Key (first 10 chars): AIzaSyDlRT...
```

If you see:
```
⚠️  GEMINI_API_KEY not configured
```
Then the API key isn't being read from `.env`.

### 2. Check .env File Location

Make sure `.env` is in the `backend/` directory, not the root:
```
/backend/.env  ✅ Correct
/.env          ❌ Wrong
```

### 3. Verify .env Format

Your `.env` should have:
```env
GEMINI_API_KEY=AIzaSyDlRTrCb6_osyeTIbQZYvR4UnKuSKgGOzo
```

**Important:**
- No spaces around `=`
- No quotes (unless the key itself has spaces)
- No trailing spaces

### 4. Restart Backend After Changes

After editing `.env`, you MUST restart the backend:
```bash
# Stop the server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

### 5. Check Console Logs

When you send a message, check backend console for:
```
Using Gemini with model: gemini-2.5-flash
Sending message to Gemini: how to scan QR...
Chat history length: 0 messages
Gemini response received: To scan a QR code in UPI...
```

### 6. Common Errors

#### "Gemini API not configured"
- `.env` file not found
- API key not set
- Backend not restarted after adding key

#### "API authentication failed"
- Invalid API key
- API key has extra spaces/characters
- API key is revoked/expired

#### "Quota exceeded"
- Free tier limit reached
- Check usage at: https://aistudio.google.com/apikey

#### Getting fallback responses
- Check backend console logs
- Look for error messages
- Verify API key is correct

### 7. Test API Key Directly

Test your API key works:

```bash
cd backend
node -e "
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
model.generateContent('Hello').then(result => {
  console.log('✅ API key works!');
  console.log('Response:', result.response.text());
}).catch(err => {
  console.error('❌ API key error:', err.message);
});
"
```

### 8. Check Network Connection

Gemini API requires internet. If you're behind a proxy or firewall, ensure:
- Backend can access `https://generativelanguage.googleapis.com`
- No firewall blocking outbound HTTPS connections

### 9. Verify Package Installation

```bash
cd backend
npm list @google/generative-ai
```

Should show the package. If not:
```bash
npm install @google/generative-ai
```

### 10. Check Model Name

The model name must be exact:
- ✅ `gemini-2.5-flash` (correct)
- ❌ `gemini-2.5-flash-experimental` (wrong)
- ❌ `gemini-2.5` (wrong)

Current default: `gemini-2.5-flash`

## Still Not Working?

1. **Check backend console** - Look for error messages
2. **Verify API key** - Test with the script above
3. **Check .env location** - Must be in `backend/` folder
4. **Restart backend** - After any .env changes
5. **Check logs** - Look for detailed error messages

## Getting Help

When asking for help, provide:
1. Backend console output
2. Error messages
3. Result of API key test script
4. `.env` file location (but NOT the actual key!)

