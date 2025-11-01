// Quick test script to verify Gemini API setup
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('🔍 Testing Gemini API Configuration...\n');

// Check if API key exists
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment variables');
  console.log('Please check your .env file in the backend directory');
  process.exit(1);
}

console.log('✅ API Key found:', API_KEY.substring(0, 10) + '...');
console.log('📝 Testing API connection...\n');

// Test the API
try {
  const genAI = new GoogleGenerativeAI(API_KEY.trim());
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  console.log('⏳ Sending test message to Gemini...');
  
  model.generateContent('Say "Hello, Gemini is working!" in exactly 5 words.')
    .then(result => {
      const response = result.response.text();
      console.log('✅ SUCCESS! Gemini API is working correctly!');
      console.log('📨 Response:', response);
      console.log('\n🎉 Your Gemini integration is ready to use!');
    })
    .catch(error => {
      console.error('❌ ERROR: Gemini API call failed');
      console.error('Error message:', error.message);
      
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('PERMISSION_DENIED')) {
        console.error('\n💡 This means your API key is invalid or expired.');
        console.error('   Please get a new API key from: https://aistudio.google.com/apikey');
      } else if (error.message.includes('quota') || error.message.includes('QUOTA')) {
        console.error('\n💡 API quota exceeded. Check your usage at: https://aistudio.google.com/apikey');
      } else {
        console.error('\n💡 Check your internet connection and try again.');
        console.error('   Full error:', error);
      }
      process.exit(1);
    });
} catch (error) {
  console.error('❌ ERROR: Failed to initialize Gemini AI');
  console.error('Error:', error.message);
  process.exit(1);
}

