import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAdmin: false
  },
  reducers: {
    login: (state) => {
      state.isAdmin = true;
    },
    logout: (state) => {
      state.isAdmin = false;
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
