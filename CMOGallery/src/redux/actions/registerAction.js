import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../utils/api';

export const registerUser = createAsyncThunk(
  'register/user', 
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await api.post('https://api.com/login', { username, password });
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);
