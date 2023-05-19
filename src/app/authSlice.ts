import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { auth_url } from '../utils/url';
import {
  AuthState,
  LoginDataActionPayload,
  RegisterDataActionPayload,
  User,
} from './types';

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  message: null,
  status: null,
  user: null,
};

const persistedState: AuthState = localStorage.getItem('auth')
  ? JSON.parse(localStorage.getItem('auth')!)
  : initialState;

const authSlice = createSlice({
  name: 'auth',
  initialState: persistedState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(sendRegisterRequest.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(sendRegisterRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });

    builder.addCase(sendRegisterRequest.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.message = action.error.message ?? null;
      state.user = null;
    });

    builder.addCase(sendLoginRequest.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(sendLoginRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });

    builder.addCase(sendLoginRequest.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.message = action.error.message ?? null;
      state.user = null;
    });

    builder.addCase(sendLogoutRequest.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(sendLogoutRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    });

    builder.addCase(sendLogoutRequest.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.message = action.error.message ?? null;
      state.user = null;
    });

    builder.addCase(sendAuthenticateRequest.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(sendAuthenticateRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });

    builder.addCase(sendAuthenticateRequest.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.message = action.error.message ?? null;
      state.user = null;
    });
  },
});

const sendRegisterRequest = createAsyncThunk(
  'auth/register',
  async (payload: RegisterDataActionPayload) => {
    const response = await axios.post(`${auth_url}/register`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const user = response.data.userData as User;
    const token = response.data.jwt;

    localStorage.setItem('accessToken', JSON.stringify(token));

    return user;
  },
);

const sendLoginRequest = createAsyncThunk(
  'auth/login',
  async (payload: LoginDataActionPayload) => {
    const response = await axios.post(`${auth_url}/login`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const user = response.data.userData as User;
    const token = response.data.jwt;

    localStorage.setItem('accessToken', JSON.stringify(token));

    return user;
  },
);

const sendLogoutRequest = createAsyncThunk('auth/logout', async () => {
  const accessToken = localStorage.getItem('accessToken');

  const response = await axios.post(
    `${auth_url}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken?.substring(
          1,
          accessToken.length - 1,
        )}`,
      },
    },
  );

  localStorage.removeItem('accessToken');
  return response.data.message;
});

const sendAuthenticateRequest = createAsyncThunk(
  'auth/authenticate',
  async () => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.get(`${auth_url}/authenticate`, {
      headers: {
        Authorization: `Bearer ${accessToken?.substring(
          1,
          accessToken.length - 1,
        )}`,
      },
    });

    const user = response.data.userData as User;
    return user;
  },
);

export {
  sendAuthenticateRequest,
  sendLoginRequest,
  sendLogoutRequest,
  sendRegisterRequest,
};
export default authSlice.reducer;
