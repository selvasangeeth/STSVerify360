import { createSlice } from '@reduxjs/toolkit';

// Updated initial state without user and token
const initialState = {
  isLoading: false,
  error: null,
};

// Create a slice without authentication-related actions
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Removed login actions
    // Removed logout action

    // You can still keep any actions here if you plan to extend functionality later
  },
});

export const { } = authSlice.actions; // No actions to export

// Exporting the updated reducer (now without authentication logic)
export default authSlice.reducer;
