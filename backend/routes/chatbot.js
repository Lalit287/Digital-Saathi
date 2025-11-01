const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { authMiddleware } = require('../middleware/auth');
const Lesson = require('../models/Lesson');

const router = express.Router();

// Gemini Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'; // Gemini 2.5 Flash for fast, accurate responses

// Initialize Gemini AI
let genAI = null;
if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here' && GEMINI_API_KEY.trim().length > 0) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY.trim());
    console.log(`✅ Gemini AI initialized successfully with model: ${GEMINI_MODEL}`);
    console.log(`API Key (first 10 chars): ${GEMINI_API_KEY.substring(0, 10)}...`);
  } catch (error) {
    console.error('❌ Error initializing Gemini AI:', error.message);
    genAI = null;
  }
} else {
  console.warn('⚠️  GEMINI_API_KEY not configured. Chatbot will use fallback responses.');
  console.log('To enable Gemini, set GEMINI_API_KEY in your .env file');
}

// Fallback response when OpenAI API is not configured - uses lesson content
async function getFallbackResponse(message, language) {
  const lowerMessage = message.toLowerCase().trim();
  
  // Handle greetings
  if (['hi', 'hello', 'hey', 'namaste', 'नमस्ते', 'hi!', 'hello!'].includes(lowerMessage)) {
    return language === 'hi' 
      ? 'नमस्ते! मैं Digital Saathi हूं। मैं डिजिटल साक्षरता, UPI, बैंकिंग, और साइबर सुरक्षा के बारे में मदद कर सकता हूं। आप क्या जानना चाहेंगे?'
      : 'Hello! I\'m Digital Saathi. I can help you with digital literacy, UPI, banking, investments, and cybersecurity. What would you like to know?';
  }
  
  // Try to find relevant lesson content first
  try {
    const relevantLessons = await getRelevantLessonContext(message);
    
    if (relevantLessons.length > 0) {
      // Use actual lesson content for response
      const lesson = relevantLessons[0];
      const content = lesson.content || '';
      
      // Extract relevant answer from lesson content
      let answer = content.substring(0, 600);
      
      // For specific "how to" questions, look for step-by-step instructions
      if (lowerMessage.includes('how to') || lowerMessage.includes('how do')) {
        // Extract steps from content
        const stepsMatch = content.match(/(?:step\s*\d+|^\d+\.|\n\d+\.)(.*?)(?:\n|$)/gi);
        if (stepsMatch && stepsMatch.length > 0) {
          answer = 'Here\'s how:\n\n' + stepsMatch.slice(0, 5).join('\n');
        }
      }
      
      if (language === 'hi') {
        return `प्रासंगिक जानकारी:\n\n${answer.substring(0, 500)}...\n\nअधिक जानकारी के लिए "${lesson.title}" लेसन देखें।`;
      }
      return `${answer.substring(0, 600)}...\n\nFor more details, check the "${lesson.title}" lesson in Learning Modules.`;
    }
  } catch (error) {
    console.error('Error fetching lesson for fallback:', error);
  }
  
  // Handle specific UPI queries
  if (lowerMessage.includes('qr') && lowerMessage.includes('upi')) {
    return language === 'hi'
      ? 'UPI में QR कोड स्कैन करने के लिए: 1) GPay/PhonePe/BHIM ऐप खोलें, 2) "Scan QR" या "Pay" बटन पर क्लिक करें, 3) कैमरा से QR कोड को स्कैन करें, 4) राशि दर्ज करें, 5) UPI PIN डालकर भुगतान करें। सुनिश्चित करें कि QR कोड वैध और भरोसेमंद स्रोत से है।'
      : 'To scan QR code in UPI: 1) Open GPay/PhonePe/BHIM app, 2) Tap "Scan QR" or "Pay", 3) Scan the QR code with camera, 4) Enter amount, 5) Enter UPI PIN to pay. Always verify the QR code is from a trusted source.';
  }
  
  if (lowerMessage.includes('qr') || lowerMessage.includes('scan')) {
    return language === 'hi'
      ? 'QR कोड स्कैन करने के लिए: 1) UPI ऐप (GPay/PhonePe/BHIM) खोलें, 2) "Scan & Pay" या QR आइकन पर टैप करें, 3) QR कोड को कैमरा के सामने रखें, 4) राशि दर्ज करें, 5) UPI PIN से भुगतान करें। सावधान: केवल भरोसेमंद विक्रेताओं से QR कोड स्कैन करें।'
      : 'To scan a QR code: 1) Open your UPI app (GPay/PhonePe/BHIM), 2) Tap "Scan & Pay" or QR icon, 3) Point camera at QR code, 4) Enter amount, 5) Pay with UPI PIN. Caution: Only scan QR codes from trusted merchants.';
  }
  
  // Handle cybersecurity in banking
  if (lowerMessage.includes('cybersecurity') && (lowerMessage.includes('bank') || lowerMessage.includes('banking'))) {
    return language === 'hi'
      ? 'बैंकिंग सेवाओं में साइबर सुरक्षा: 1) मजबूत पासवर्ड का उपयोग करें, 2) दो-कारक प्रमाणीकरण सक्षम करें, 3) OTP कभी शेयर न करें, 4) सार्वजनिक Wi-Fi पर बैंकिंग न करें, 5) लेनदेन अलर्ट सक्षम करें, 6) संदिग्ध ईमेल/एसएमएस पर क्लिक न करें। बैंक कभी भी OTP या PIN नहीं मांगते।'
      : 'Cybersecurity in banking services means: 1) Use strong passwords, 2) Enable two-factor authentication, 3) Never share OTP/PIN, 4) Avoid banking on public Wi-Fi, 5) Enable transaction alerts, 6) Don\'t click suspicious emails/SMS. Banks never ask for OTP or PIN. Key practices: Log out after sessions, use official apps only, verify transaction details before confirming.';
  }
  
  // Handle UPI-related queries
  if (lowerMessage.includes('upi')) {
    if (lowerMessage.includes('safe') || lowerMessage.includes('secure')) {
      return language === 'hi'
        ? 'UPI को सुरक्षित रूप से उपयोग करने के लिए: 1) अपना UPI PIN कभी शेयर न करें, 2) भुगतान से पहले रिसीवर की जानकारी सत्यापित करें, 3) केवल आधिकारिक ऐप्स (GPay, PhonePe, BHIM) का उपयोग करें, 4) संदिग्ध भुगतान अनुरोधों को अस्वीकार करें, 5) लेनदेन इतिहास नियमित रूप से जांचें।'
        : 'To use UPI safely: 1) Never share your UPI PIN with anyone, 2) Verify recipient details before paying, 3) Use only official apps like GPay, PhonePe, or BHIM, 4) Reject suspicious payment requests, 5) Regularly check transaction history.';
    }
    return language === 'hi'
      ? 'UPI (Unified Payments Interface) एक सुरक्षित डिजिटल भुगतान प्रणाली है। सुरक्षित रूप से उपयोग करने के लिए: 1) अपना UPI PIN कभी शेयर न करें, 2) भुगतान से पहले रिसीवर की जानकारी सत्यापित करें, 3) केवल आधिकारिक ऐप्स (GPay, PhonePe, BHIM) का उपयोग करें।'
      : 'UPI (Unified Payments Interface) is a secure digital payment system. To use safely: 1) Never share your UPI PIN, 2) Verify recipient details before paying, 3) Use only official apps like GPay, PhonePe, or BHIM.';
  }
  
  // Handle phishing/scam queries
  if (lowerMessage.includes('phishing') || lowerMessage.includes('scam') || lowerMessage.includes('fraud')) {
    return language === 'hi'
      ? 'स्कैम से बचने के लिए: 1) कभी भी OTP या PIN शेयर न करें, 2) संदिग्ध लिंक पर क्लिक न करें, 3) बैंक/सरकारी कॉल्स की पुष्टि आधिकारिक नंबरों से करें, 4) यदि संदेह हो तो सीधे संगठन से संपर्क करें।'
      : 'To avoid scams: 1) Never share OTP or PIN with anyone, 2) Don\'t click suspicious links, 3) Verify bank/government calls through official numbers, 4) When in doubt, contact the organization directly.';
  }
  
  // Handle DigiLocker/Aadhaar queries
  if (lowerMessage.includes('aadhaar') || lowerMessage.includes('digilocker') || lowerMessage.includes('aadhar')) {
    return language === 'hi'
      ? 'DigiLocker से Aadhaar डाउनलोड करने के लिए: 1) digilocker.gov.in पर जाएं, 2) मोबाइल नंबर से साइन अप करें, 3) OTP से वेरिफाई करें, 4) "Pull Partner Documents" में UIDAI-Aadhaar चुनें, 5) Aadhaar नंबर और OTP डालें।'
      : 'To download Aadhaar from DigiLocker: 1) Visit digilocker.gov.in, 2) Sign up with mobile number, 3) Verify with OTP, 4) Go to "Pull Partner Documents" and select UIDAI-Aadhaar, 5) Enter Aadhaar number and OTP.';
  }
  
  // Handle cybersecurity general queries
  if (lowerMessage.includes('cybersecurity') || lowerMessage.includes('cyber security') || lowerMessage.includes('cyber safety')) {
    return language === 'hi'
      ? 'साइबर सुरक्षा: 1) मजबूत, अनूठे पासवर्ड का उपयोग करें, 2) OTP/PIN कभी शेयर न करें, 3) संदिग्ध लिंक/अटैचमेंट पर क्लिक न करें, 4) दो-कारक प्रमाणीकरण सक्षम करें, 5) सार्वजनिक Wi-Fi पर संवेदनशील कार्य न करें, 6) ऐप्स को नियमित रूप से अपडेट करें।'
      : 'Cybersecurity essentials: 1) Use strong, unique passwords, 2) Never share OTP/PIN, 3) Don\'t click suspicious links/attachments, 4) Enable two-factor authentication, 5) Avoid sensitive tasks on public Wi-Fi, 6) Keep apps updated. For banking specifically: Use official apps, enable transaction alerts, verify all transactions before confirming.';
  }
  
  // Handle online banking queries
  if (lowerMessage.includes('online banking') || (lowerMessage.includes('bank') && lowerMessage.includes('online'))) {
    return language === 'hi'
      ? 'ऑनलाइन बैंकिंग सुरक्षा: 1) मजबूत पासवर्ड और यूजर आईडी का उपयोग करें, 2) हर सत्र के बाद लॉग आउट करें, 3) केवल आधिकारिक बैंकिंग ऐप्स का उपयोग करें, 4) लेनदेन अलर्ट सक्षम करें, 5) सार्वजनिक Wi-Fi पर बैंकिंग न करें, 6) OTP कभी शेयर न करें।'
      : 'Online banking safety: 1) Use strong passwords and User ID, 2) Log out after each session, 3) Use only official banking apps, 4) Enable transaction alerts, 5) Avoid banking on public Wi-Fi, 6) Never share OTP. Common operations include balance check, money transfer (NEFT/RTGS/IMPS), bill payments, and viewing transaction history.';
  }
  
  // Default fallback with suggestion to check lessons
  return language === 'hi'
    ? 'क्षमा करें, मैं इस प्रश्न का सटीक उत्तर नहीं दे सकता। कृपया Learning Modules में जाकर संबंधित विषय की जानकारी देखें, या एक विशिष्ट प्रश्न पूछें (जैसे "UPI कैसे उपयोग करें", "स्कैम कैसे बचें")।'
    : 'Sorry, I cannot provide an accurate answer to this question. Please check the Learning Modules for related topics, or ask a more specific question (like "how to use UPI", "how to avoid scams", "how to download Aadhaar").';
}

// Helper function to find relevant lessons based on query
async function getRelevantLessonContext(userMessage) {
  try {
    if (!userMessage || typeof userMessage !== 'string') {
      return [];
    }

    // Extract key terms from the message
    const keywords = userMessage.toLowerCase().trim();
    
    // If message is too short or just greeting, return empty
    if (keywords.length < 3 || ['hi', 'hello', 'hey', 'namaste', 'नमस्ते'].includes(keywords)) {
      return [];
    }

    // Split into words and search for lessons
    const words = keywords.split(/\s+/).filter(word => word.length > 2);
    
    if (words.length === 0) {
      return [];
    }

    const searchTerms = words.join('|');
    const lessons = await Lesson.find({ 
      isActive: true,
      $or: [
        { title: { $regex: searchTerms, $options: 'i' } },
        { description: { $regex: searchTerms, $options: 'i' } },
        { content: { $regex: searchTerms, $options: 'i' } },
        { category: { $regex: searchTerms, $options: 'i' } }
      ]
    }).limit(3).select('title description content category');

    return lessons.map(lesson => ({
      title: lesson.title,
      category: lesson.category,
      content: (lesson.content || '').substring(0, 500) // First 500 chars for context
    }));
  } catch (error) {
    console.error('Error fetching lesson context:', error);
    return [];
  }
}

// Chat endpoint
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, language = 'en', conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required and must be non-empty' });
    }

    // Check if Gemini API is configured
    if (!genAI || !GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.error('Gemini API not configured - using fallback responses');
      console.log('To use Gemini, set GEMINI_API_KEY in .env file');
      
      // Provide a helpful fallback response using lesson content
      const fallbackResponse = await getFallbackResponse(message, language);
      
      return res.json({
        response: fallbackResponse,
        language
      });
    }

    console.log(`Using Gemini with model: ${GEMINI_MODEL}`);

    // Get relevant lesson context for better answers (non-blocking)
    let relevantLessons = [];
    try {
      relevantLessons = await getRelevantLessonContext(message);
    } catch (error) {
      console.error('Error fetching lesson context (continuing without context):', error);
      // Continue without context if there's an error
    }

    // Enhanced system prompt for accurate, to-the-point responses
    const systemPrompt = `You are Digital Saathi, an expert AI tutor specializing in digital literacy and financial awareness for Indian citizens. 

CRITICAL: ANSWER THE EXACT QUESTION ASKED. Be specific and direct.

CORE INSTRUCTIONS:
- Read the question CAREFULLY and answer EXACTLY what is being asked
- If asked "how to scan QR in UPI" → explain the step-by-step process of scanning QR codes
- If asked "what is cybersecurity in banking" → explain cybersecurity SPECIFICALLY in context of banking services
- Provide ACCURATE, FACTUAL, and TO-THE-POINT responses
- Be direct and specific - avoid generic answers that don't address the question
- Focus on actionable steps and practical advice
- Use concrete examples relevant to India (mention specific apps, banks, government portals)
- Keep responses concise but complete (3-6 sentences typically)

YOUR EXPERTISE - Answer SPECIFICALLY based on what's asked:
1. UPI & Digital Payments: 
   - "How to scan QR": Explain opening app → tap scan → point camera → enter amount → enter PIN
   - GPay, PhonePe, BHIM apps, QR code scanning, payment requests, UPI PIN safety
2. Online Banking: 
   - Net banking, mobile banking apps, IMPS/NEFT/RTGS transfers
   - Security practices, transaction alerts, password management
3. E-Governance: 
   - DigiLocker, Aadhaar download, PAN application, voter services, government portals
4. Cybersecurity (especially banking context): 
   - For banking: Password security, 2FA, OTP safety, secure login, transaction verification
   - Phishing prevention, safe browsing, secure passwords, avoiding scams
5. Investments: 
   - SIP, FD, PPF, mutual funds, SEBI registration, investment scams awareness
6. Scam Prevention: 
   - Fake loan apps, KYC fraud, UPI fraud, job scams, investment frauds

RESPONSE STYLE:
- START with a direct answer to the specific question
- If "how to" question → provide numbered step-by-step instructions
- If "what is" question → define clearly with context
- Include practical examples and specific app names when relevant
- End with a helpful tip if relevant
- Use simple language but be precise
- NO generic responses - always be specific to the question asked

${relevantLessons.length > 0 ? `\nRELEVANT LESSON CONTEXT FROM DATABASE:\n${relevantLessons.map((lesson, idx) => `${idx + 1}. ${lesson.title} (${lesson.category}):\n${(lesson.content || '').substring(0, 400)}\n---\n`).join('\n')}\n\nUSE THIS CONTEXT to provide accurate, specific answers. Extract relevant information that directly answers the user's question.` : ''}

Always respond in ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'} unless specifically asked otherwise.

REMEMBER: Answer the EXACT question asked, not a related topic.`;

    // Build conversation history
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add recent conversation history (last 10 messages for context)
    // Validate conversation history format
    if (Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory
        .filter(msg => msg && msg.role && msg.content && typeof msg.content === 'string')
        .slice(-10);
      
      recentHistory.forEach(msg => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ 
            role: msg.role, 
            content: String(msg.content).trim() 
          });
        }
      });
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt, // Use system instruction for better context
      generationConfig: {
        temperature: 0.2, // Lower temperature for more accurate, deterministic responses
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 800, // Max response length
      },
    });

    // Convert messages to Gemini chat format
    // Filter out system message and convert to Gemini format
    const conversationMessages = messages.filter(msg => msg.role !== 'system');
    
    // Get current user message (should be the last message)
    const userContent = message.trim();
    if (!userContent) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }
    
    // Build chat history for Gemini (alternating user/assistant messages)
    const chatHistory = [];
    if (conversationMessages.length > 1) {
      // We have conversation history (more than just the current message)
      for (let i = 0; i < conversationMessages.length - 1; i += 2) {
        const userMsg = conversationMessages[i];
        const assistantMsg = conversationMessages[i + 1];
        
        if (userMsg && userMsg.role === 'user' && assistantMsg && assistantMsg.role === 'assistant') {
          const userText = String(userMsg.content || '').trim();
          const assistantText = String(assistantMsg.content || '').trim();
          
          if (userText && assistantText) {
            chatHistory.push({
              role: 'user',
              parts: [{ text: userText }]
            });
            chatHistory.push({
              role: 'model',
              parts: [{ text: assistantText }]
            });
          }
        }
      }
    }

    // Start chat session with or without history
    const chat = chatHistory.length > 0 
      ? model.startChat({ history: chatHistory })
      : model.startChat();

    // Call Gemini API
    let response;
    try {
      console.log(`📤 Sending message to Gemini (${GEMINI_MODEL}):`, userContent.substring(0, 100));
      if (chatHistory.length > 0) {
        console.log(`📜 Using ${chatHistory.length / 2} previous conversation pairs`);
      }
      
      const result = await chat.sendMessage(userContent);
      const responseText = result.response;
      
      if (!responseText || !responseText.text) {
        throw new Error('Invalid response from Gemini API - no text in response');
      }

      response = responseText.text().trim();
      console.log(`✅ Gemini response received:`, response.substring(0, 100));
    } catch (error) {
      console.error('❌ Gemini API error:', {
        message: error.message,
        code: error.code,
        status: error.status || error.statusCode,
        cause: error.cause?.message
      });
      
      // Handle specific error types
      if (error.message && (error.message.includes('API_KEY_INVALID') || error.message.includes('PERMISSION_DENIED') || error.status === 403 || error.message.includes('401'))) {
        return res.status(500).json({ 
          message: 'Gemini API authentication failed. Please check your GEMINI_API_KEY in the .env file.',
          error: 'Invalid API key'
        });
      }
      
      if (error.message && (error.message.includes('quota') || error.message.includes('QUOTA_EXCEEDED') || error.message.includes('RESOURCE_EXHAUSTED') || error.status === 429)) {
        return res.status(429).json({ 
          message: 'Gemini API quota exceeded. Please check your API quota or try again later.',
          error: 'Quota exceeded'
        });
      }
      
      // For other errors, use fallback
      console.log('⚠️  Using fallback response due to API error');
      const fallbackResponse = await getFallbackResponse(message, language);
      return res.json({
        response: fallbackResponse,
        language,
        warning: 'Using fallback response due to API error'
      });
    }

    if (!response || response.length === 0) {
      throw new Error('Empty response from Gemini API');
    }

    res.json({
      response,
      language
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    
    // Provide more helpful error messages
    let errorMessage = 'Sorry, I encountered an error. Please try again.';
    
    if (error.message && (error.message.includes('API key') || error.message.includes('authentication') || error.message.includes('PERMISSION_DENIED'))) {
      errorMessage = 'Gemini API configuration error. Please check your GEMINI_API_KEY in the .env file.';
    } else if (error.message && (error.message.includes('rate limit') || error.message.includes('quota') || error.message.includes('QUOTA_EXCEEDED'))) {
      errorMessage = 'API quota exceeded. Please check your Gemini API quota or try again later.';
    } else if (error.message && error.message.includes('timeout')) {
      errorMessage = 'Request timed out. The AI model is taking longer than expected.';
    } else if (process.env.NODE_ENV === 'development') {
      errorMessage = `Error: ${error.message}`;
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

