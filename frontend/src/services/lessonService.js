import api from './api';

export const lessonService = {
  getAll: async (params = {}) => {
    const response = await api.get('/lessons', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },
  
  completeLesson: async (id, score = 0) => {
    const response = await api.post(`/lessons/${id}/complete`, { score });
    return response.data;
  },
};

