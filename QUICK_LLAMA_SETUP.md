# Quick LLaMA Setup for Digital Saathi

## ✅ What Changed

Your AI tutor now uses **LLaMA models** instead of GPT for **maximum accuracy**. The system supports two options:

1. **Together AI** (Cloud - Recommended) - Easy setup, high accuracy
2. **Ollama** (Local) - Free, runs on your machine

## 🚀 Quick Start (Together AI - 2 Minutes)

1. **Get Free API Key:**
   - Visit: https://api.together.xyz/
   - Sign up (free $25 credits)
   - Copy your API key

2. **Add to Backend:**
   ```bash
   cd backend
   # Edit .env file (create if doesn't exist)
   ```

   Add this line:
   ```env
   TOGETHER_API_KEY=your_api_key_here
   ```

3. **Restart Backend:**
   ```bash
   npm run dev
   ```

4. **Test:**
   - Open Chat page in frontend
   - Ask: "how to scan QR in UPI"
   - You should get accurate, step-by-step response!

## 📊 Model Options

By default, uses **Llama 3.1 70B Turbo** (highest accuracy).

To change model, add to `.env`:
```env
LLAMA_MODEL=meta-llama/Llama-3.1-70B-Instruct-Turbo
```

**Best for Accuracy:**
- `meta-llama/Llama-3.1-70B-Instruct-Turbo` ⭐ (default)
- `meta-llama/Llama-3-70B-Instruct`

**Faster/Lower Cost:**
- `meta-llama/Llama-3.1-8B-Instruct-Turbo`

## 🖥️ Alternative: Local Ollama Setup

If you prefer local (free, private):

```bash
# 1. Install Ollama
brew install ollama  # macOS
# Or download from: https://ollama.ai/

# 2. Pull model
ollama pull llama3.1:70b

# 3. Start Ollama
ollama serve

# 4. Add to backend/.env
USE_OLLAMA=true
OLLAMA_MODEL=llama3.1:70b
```

## ⚙️ Configuration

Your `backend/.env` should have:

**For Together AI:**
```env
TOGETHER_API_KEY=your_key_here
LLAMA_MODEL=meta-llama/Llama-3.1-70B-Instruct-Turbo
```

**OR For Ollama:**
```env
USE_OLLAMA=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:70b
```

## 🔍 Verify It's Working

Check backend logs when starting:
- ✅ `Using Together AI with model: meta-llama/Llama-3.1-70B-Instruct-Turbo`
- ✅ `Using Ollama with model: llama3.1:70b`
- ❌ `LLaMA API not configured` (fallback mode)

## 💡 Why LLaMA?

- ✅ **Higher Accuracy** - Optimized for instruction following
- ✅ **Lower Cost** - More affordable than GPT
- ✅ **Fast Responses** - Turbo models are quick
- ✅ **Open Source** - Can run locally for free

## 🆘 Troubleshooting

**"LLaMA API not configured"**
- Check `.env` file has `TOGETHER_API_KEY` or `USE_OLLAMA=true`
- Restart backend after editing `.env`

**"API authentication failed"**
- Verify your API key is correct
- Check Together AI account has credits

**Still using fallback?**
- Check backend console logs
- Ensure API key doesn't have extra spaces
- Verify environment variables are loaded

For detailed setup, see `LLAMA_SETUP.md`

