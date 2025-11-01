import api from './api';

export const investmentService = {
  calculate: async (data) => {
    const response = await api.post('/investments/calculate', data);
    return response.data;
  },
};

