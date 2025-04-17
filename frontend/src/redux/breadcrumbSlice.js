import { createSlice } from '@reduxjs/toolkit';
const breadcrumbSlice = createSlice({
  name: 'breadcrumbs',
  initialState: {
    items: [], // Ensure it's an array
  },
  reducers: {
    updateBreadcrumbs: (state, action) => {
      state.items = action.payload; // Always update with a valid array
    },
  },
});
export const { updateBreadcrumbs } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;