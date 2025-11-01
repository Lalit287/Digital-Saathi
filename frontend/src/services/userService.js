import api from './api';

export const userService = {
  getLeaderboard: async (params = {}) => {
    const response = await api.get('/users/leaderboard', { params });
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

