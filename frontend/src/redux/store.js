import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import breadcrumbReducer from "./breadcrumbSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    breadcrumbs: breadcrumbReducer,
  },
});