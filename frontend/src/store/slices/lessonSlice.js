import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lessons: [],
  currentLesson: null,
  loading: false,
  error: null,
  filter: {
    category: null,
    difficulty: null,
  },
};

const lessonSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLessons: (state, action) => {
      state.lessons = action.payload;
    },
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    addLesson: (state, action) => {
      state.lessons.push(action.payload);
    },
  },
});

export const { setLoading, setLessons, setCurrentLesson, setFilter, addLesson } = lessonSlice.actions;
export default lessonSlice.reducer;

