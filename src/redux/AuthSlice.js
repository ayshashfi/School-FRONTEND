// AuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';
import { loginUser } from '../axios/apiServers';

const initialState = {    
  user: null,
  accessToken: null,
  refreshToken: null,
  is_authenticated: false,
  is_admin: false,
  is_student: false,
  is_teacher: false,
  loading: true,
  error: null,
};

export const loginUserAsync = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      state.is_authenticated = false;
      state.is_admin = false
      state.is_student = false
      state.is_teacher = false
      localStorage.removeItem('authTokens');
    },
    updateAuthToken: (state, action) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        const decodedToken = jwtDecode(action.payload.access)
        state.user = decodedToken
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.loading = false;
        state.is_authenticated = true;
        state.is_admin = decodedToken.is_admin
        state.is_teacher = decodedToken.is_teacher
        state.is_student = decodedToken.is_student
        state.error = null;
        localStorage.setItem('authTokens', JSON.stringify(action.payload));
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { logoutUser, updateAuthToken } = authSlice.actions;

export default authSlice.reducer;