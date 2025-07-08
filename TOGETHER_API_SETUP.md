# Together API Setup Guide

## 🚀 Quick Setup

### 1. Get Your API Key

1. Go to [Together AI](https://together.ai/)
2. Sign up or log in to your account
3. Navigate to your API keys section
4. Create a new API key or copy an existing one

### 2. Add to Environment Variables

Add your API key to your `.env` file in the server directory:

```env
TOGETHER_API_KEY=your_actual_api_key_here
```

### 3. Test the Connection

Run the test script to verify everything works:

```bash
cd server
node test-together-api.js
```

## ✅ What's Fixed

The implementation has been updated to work properly with Together AI:

### Backend Changes (`server/routes/ai.js`)

- ✅ Updated to use **chat completions** endpoint (`/v1/chat/completions`)
- ✅ Changed default model to `mistralai/Mixtral-8x7B-Instruct-v0.1`
- ✅ Added proper error handling for API key issues
- ✅ Added helpful error messages for common issues
- ✅ Fixed response format handling

### Frontend Changes (`src/services/aiService.js`)

- ✅ Improved error handling and messaging
- ✅ Better response format parsing
- ✅ More robust API communication

## 🧪 Testing

### Test Script Features

- ✅ Validates API key presence
- ✅ Tests basic API connection
- ✅ Tests multiple model compatibility
- ✅ Provides detailed error messages
- ✅ Shows usage statistics

### Manual Testing

1. Start your server: `npm run dev` (in server directory)
2. Start your frontend: `npm run dev` (in root directory)
3. Try generating quiz questions or course content
4. Check browser console for any errors

## 🔧 Troubleshooting

### Common Issues

**"API key not configured"**

- Make sure `TOGETHER_API_KEY` is in your `.env` file
- Restart your server after adding the key

**"Invalid API key"**

- Double-check your API key is correct
- Ensure no extra spaces or characters

**"Rate limit exceeded"**

- Wait a moment and try again
- Check your Together AI account usage

**"Model not found"**

- Some models may be deprecated or unavailable
- The test script will show which models work

## 📊 Available Models

The implementation supports these models:

- `mistralai/Mixtral-8x7B-Instruct-v0.1` (default)
- `deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free`
- `togethercomputer/llama-2-70b-chat`

## 🎯 Features That Will Work

Once your API key is configured, these features will work:

1. **Quiz Generation**: Generate questions from course content
2. **Course Content**: AI-generated course outlines and materials
3. **Flashcard Creation**: Generate flashcards from course materials
4. **Study Recommendations**: AI-powered study suggestions
5. **Content Summarization**: Summarize uploaded materials

## 🔒 Security Notes

- Never commit your API key to version control
- The `.env` file should be in your `.gitignore`
- API keys are only used server-side for security

## 📞 Support

If you encounter issues:

1. Run the test script first
2. Check the browser console for errors
3. Verify your API key is valid on Together AI dashboard
4. Check your account has sufficient credits/quota
