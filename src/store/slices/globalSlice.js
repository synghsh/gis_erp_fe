import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  toasts: [], // { id, message, type: 'success' | 'error' | 'info' | 'warning', duration?: number }
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setGlobalError: (state, action) => {
      state.error = action.payload;
    },
    addToast: (state, action) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      state.toasts.push({
        id,
        type: 'info',
        duration: 3000,
        ...action.payload,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { setGlobalLoading, setGlobalError, addToast, removeToast, clearToasts } = globalSlice.actions;
export default globalSlice.reducer;
