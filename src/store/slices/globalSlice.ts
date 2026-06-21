import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface GlobalState {
  isLoading: boolean;
  error: string | null;
  toasts: Toast[];
}

const initialState: GlobalState = {
  isLoading: false,
  error: null,
  toasts: [],
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'> & { id?: string }>) => {
      const id = action.payload.id || Date.now().toString() + Math.random().toString(36).substr(2, 5);
      state.toasts.push({
        id,
        type: 'info',
        duration: 3000,
        ...action.payload,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { setGlobalLoading, setGlobalError, addToast, removeToast, clearToasts } = globalSlice.actions;
export default globalSlice.reducer;
