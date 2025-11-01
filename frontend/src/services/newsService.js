import api from './api';

export const newsService = {
  getScamNews: async () => {
    const response = await api.get('/scams/news');
    return response.data;
  },
};

