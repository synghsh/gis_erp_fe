import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import sidebarReducer from './slices/sidebarSlice';
import globalReducer from './slices/globalSlice';
import masterDataReducer from './slices/masterDataSlice';
import userManagementReducer from './slices/userManagementSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    sidebar: sidebarReducer,
    global: globalReducer,
    masterData: masterDataReducer,
    userManagement: userManagementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
