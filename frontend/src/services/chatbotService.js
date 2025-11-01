import api from './api';

export const chatbotService = {
  sendMessage: async (message, language = 'en', conversationHistory = []) => {
    const response = await api.post('/chatbot/chat', { 
      message, 
      language,
      conversationHistory 
    });
    return response.data;
  },
};

