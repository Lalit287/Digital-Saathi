import api from './api';

export const scamService = {
  getAll: async (params = {}) => {
    const response = await api.get('/scams', { params });
    return response.data;
  },
  
  reportScam: async (data) => {
    const response = await api.post('/scams', data);
    return response.data;
  },
};

