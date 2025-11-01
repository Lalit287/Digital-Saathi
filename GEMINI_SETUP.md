# Gemini 2.5 Flash Setup Guide

Your AI tutor is now configured to use **Google Gemini 2.5 Flash** for highly accurate responses!

## ✅ What's Configured

- **Model**: Gemini 2.5 Flash (fast, accurate)
- **Temperature**: 0.2 (optimized for accuracy)
- **Max Tokens**: 800 (sufficient for detailed responses)
- **Conversation History**: Maintained for context

## 🚀 Quick Setup (2 Minutes)

### 1. Get Your Gemini API Key

1. Visit: https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Add to Environment File

Create or edit `backend/.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

**Important:** Replace `your_api_key_here` with your actual API key.

### 3. Restart Backend

```bash
cd backend
npm run dev
```

You should see in the logs:
```
Gemini AI initialized with model: gemini-2.5-flash
```

### 4. Test It!

1. Open the Chat page in your frontend
2. Ask: "how to scan QR in UPI"
3. You should get accurate, detailed responses!

## 📝 Environment Variables

Add to `backend/.env`:

```env
# Required
GEMINI_API_KEY=your_api_key_here

# Optional (defaults shown)
GEMINI_MODEL=gemini-2.5-flash
```

## 🎯 Model Options

You can change the model by setting `GEMINI_MODEL` in `.env`:

- `gemini-2.5-flash` ⭐ (default - fast, accurate)
- `gemini-2.0-flash-exp` (experimental)
- `gemini-1.5-pro` (higher accuracy, slower)
- `gemini-1.5-flash` (alternative fast option)

## 🔍 Verify It's Working

**Check Backend Logs:**
- ✅ `Gemini AI initialized with model: gemini-2.5-flash`
- ✅ `Using Gemini with model: gemini-2.5-flash`
- ❌ `Gemini API not configured` (needs API key)

**Test in Chat:**
- Ask specific questions like "how to scan QR in UPI"
- Should get detailed, step-by-step responses
- Responses should be accurate and contextual

## 🆘 Troubleshooting

### "Gemini API not configured"
- Check `backend/.env` file exists
- Verify `GEMINI_API_KEY` is set correctly
- Restart backend after editing `.env`
- No quotes needed around the API key

### "API authentication failed"
- Verify your API key is correct
- Check for extra spaces in the API key
- Ensure API key is active in Google AI Studio

### "Quota exceeded"
- Check your Google AI Studio quota
- Free tier has generous limits
- May need to wait or upgrade plan

### Still using fallback responses?
- Check backend console logs
- Verify environment variables are loaded
- Try restarting the backend server

## 💡 Why Gemini 2.5 Flash?

- ✅ **Fast Responses** - Optimized for speed
- ✅ **High Accuracy** - Great for educational content
- ✅ **Free Tier** - Generous free quota
- ✅ **Multilingual** - Supports Hindi and English
- ✅ **Context Aware** - Maintains conversation history

## 🔐 Security Notes

- **Never commit** `.env` file to git (already in `.gitignore`)
- Keep your API key private
- Rotate keys if compromised
- Monitor usage in Google AI Studio

## 📊 API Limits

Gemini 2.5 Flash free tier typically includes:
- 15 requests per minute (RPM)
- 1,500 requests per day (RPD)
- Very generous for development/testing

For production, consider upgrading to a paid plan.

## 🎓 Accuracy Features

The integration is optimized for accuracy:
- Low temperature (0.2) for deterministic responses
- System instructions for focused answers
- Conversation history for context
- Lesson content integration
- Enhanced prompts for direct answers

---

**That's it!** Your AI tutor is now powered by Gemini 2.5 Flash. Enjoy accurate, fast responses! 🚀

