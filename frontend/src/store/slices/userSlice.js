import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: null,
  leaderboard: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setLeaderboard: (state, action) => {
      state.leaderboard = action.payload;
    },
    updatePoints: (state, action) => {
      if (state.stats) {
        state.stats.totalPoints += action.payload;
      }
    },
  },
});

export const { setLoading, setStats, setLeaderboard, updatePoints } = userSlice.actions;
export default userSlice.reducer;

