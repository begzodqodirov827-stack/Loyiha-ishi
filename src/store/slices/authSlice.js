import { createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

const { token, user } = authService.getSession();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token,
    user,
    isAuthenticated: !!token && !!user,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = authService.getSession().token;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      authService.clearSession();
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
