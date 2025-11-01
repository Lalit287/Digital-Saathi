import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { chatbotService } from '../services/chatbotService';
import { Send, Bot, User, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: 'नमस्ते! I\'m Digital Saathi, your AI tutor. I provide accurate, to-the-point answers about digital literacy, UPI, banking, investments, and cybersecurity. What would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setLoading(true);

    try {
      // Build conversation history from current messages (excluding the welcome message)
      const conversationHistory = messages
        .filter(msg => {
          // Filter out welcome message and error messages
          if (msg.role === 'bot') {
            const content = msg.content.toLowerCase();
            return !content.includes('नमस्ते') && 
                   !content.includes('sorry, i encountered') &&
                   !content.includes('error');
          }
          return true;
        })
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: String(msg.content).trim()
        }))
        .filter(msg => msg.content.length > 0); // Remove empty messages

      const response = await chatbotService.sendMessage(
        userInput, 
        user?.language || 'en',
        conversationHistory
      );
      
      if (response && response.response) {
        setMessages((prev) => [...prev, { role: 'bot', content: response.response }]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Show more helpful error messages
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message?.includes('Network') || error.message?.includes('ECONNREFUSED')) {
        errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Please login to use the chatbot.';
      } else if (error.response?.status === 500) {
        errorMessage = error.response.data?.message || 'Server error. Please try again.';
      }
      
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 dark:bg-blue-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                <Loader className="w-5 h-5 animate-spin text-gray-600" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about digital literacy, UPI, banking, scams..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

