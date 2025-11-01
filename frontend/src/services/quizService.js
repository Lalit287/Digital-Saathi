import api from './api';

export const quizService = {
  getById: async (id) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },
  
  submitQuiz: async (id, answers) => {
    const response = await api.post(`/quizzes/${id}/submit`, { answers });
    return response.data;
  },
};

