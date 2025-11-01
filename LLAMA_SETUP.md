# LLaMA Model Setup Guide

This guide explains how to set up LLaMA models for accurate AI responses in Digital Saathi.

## Why LLaMA?

LLaMA (Large Language Model Meta AI) models, especially **Llama 3.1 70B**, provide highly accurate responses for educational content. The chatbot now uses LLaMA instead of GPT for better accuracy and cost-effectiveness.

## Setup Options

### Option 1: Together AI (Recommended for Production)

Together AI provides cloud-hosted LLaMA models with high accuracy.

1. **Get API Key:**
   - Visit: https://api.together.xyz/
   - Sign up for free account (includes $25 free credits)
   - Go to API Keys section and create a new key

2. **Configure Backend:**
   ```bash
   cd backend
   ```

   Add to `.env` file:
   ```env
   TOGETHER_API_KEY=your_together_api_key_here
   LLAMA_MODEL=meta-llama/Llama-3.1-70B-Instruct-Turbo
   ```

3. **Available Models (by accuracy):**
   - `meta-llama/Llama-3.1-70B-Instruct-Turbo` - **Best accuracy, recommended**
   - `meta-llama/Llama-3-70B-Instruct` - High accuracy
   - `meta-llama/Llama-3.1-8B-Instruct-Turbo` - Faster, lower cost
   - `mistralai/Mixtral-8x7B-Instruct-v0.1` - Good balance

### Option 2: Ollama (Local Development)

Ollama allows running LLaMA models locally on your machine.

1. **Install Ollama:**
   ```bash
   # macOS
   brew install ollama
   
   # Or download from: https://ollama.ai/
   ```

2. **Pull LLaMA Model:**
   ```bash
   # Best accuracy (requires ~40GB RAM)
   ollama pull llama3.1:70b
   
   # Or lighter version (requires ~8GB RAM)
   ollama pull llama3.1:8b
   
   # Alternative high-accuracy model
   ollama pull llama3:70b
   ```

3. **Start Ollama:**
   ```bash
   ollama serve
   # This runs on http://localhost:11434 by default
   ```

4. **Configure Backend:**
   Add to `backend/.env`:
   ```env
   USE_OLLAMA=true
   OLLAMA_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.1:70b
   ```

## Configuration

### Environment Variables

Add to `backend/.env`:

```env
# Together AI (Option 1)
TOGETHER_API_KEY=your_api_key_here
LLAMA_MODEL=meta-llama/Llama-3.1-70B-Instruct-Turbo

# OR Ollama (Option 2)
USE_OLLAMA=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:70b
```

### Model Selection for Accuracy

For **maximum accuracy**, use:
- **Together AI**: `meta-llama/Llama-3.1-70B-Instruct-Turbo`
- **Ollama**: `llama3.1:70b`

These models are specifically optimized for instruction following and provide accurate, contextual responses.

## Testing

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check Logs:**
   You should see either:
   - `Using Together AI with model: meta-llama/Llama-3.1-70B-Instruct-Turbo`
   - `Using Ollama with model: llama3.1:70b`

3. **Test in Frontend:**
   - Open the Chat page
   - Ask: "how to scan QR in UPI"
   - Should get accurate, step-by-step response

## Troubleshooting

### "LLaMA API not configured"
- Check your `.env` file has `TOGETHER_API_KEY` or `USE_OLLAMA=true`
- Restart the backend server after changing `.env`

### "API authentication failed"
- Verify your Together AI API key is correct
- Check your Together AI account has credits remaining

### "Ollama connection error"
- Ensure Ollama is running: `ollama serve`
- Check the model is pulled: `ollama list`
- Verify `OLLAMA_URL` in `.env` matches your Ollama server

### Slow Responses
- Use `Llama-3.1-70B-Instruct-Turbo` for faster responses (Together AI)
- For Ollama, try the 8B model: `ollama pull llama3.1:8b`

## Cost & Performance

### Together AI
- **Llama 3.1 70B Turbo**: ~$0.0008 per 1K tokens (very affordable)
- Free tier includes $25 credits (thousands of queries)
- Production-ready, low latency

### Ollama
- **Free** (runs on your machine)
- Requires sufficient RAM (8GB for 8B, 40GB+ for 70B)
- Better for development, privacy-conscious setups

## Fallback Behavior

If LLaMA API is not configured, the chatbot automatically uses:
1. Enhanced fallback responses with keyword matching
2. Lesson content from database for context
3. Specific handlers for common questions (UPI, banking, cybersecurity)

This ensures the chatbot always works, even without API configuration.

## Accuracy Improvements

The LLaMA integration includes:
- ✅ Lower temperature (0.2) for more deterministic, accurate responses
- ✅ Enhanced system prompts emphasizing accuracy
- ✅ Lesson context injection for domain-specific knowledge
- ✅ Conversation history for contextual understanding
- ✅ Stop sequences to prevent hallucination

