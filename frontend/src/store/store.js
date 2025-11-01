import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import lessonSlice from './slices/lessonSlice';
import userSlice from './slices/userSlice';
import themeSlice from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    lessons: lessonSlice,
    user: userSlice,
    theme: themeSlice,
  },
});

