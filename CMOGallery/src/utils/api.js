// src/utils/api.js
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { baseUrl } from '../services/apiConfig';
import store from '../redux/store';
import { updateNetwork } from '../redux/reducers/NetworkReducer';
const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
});

api.interceptors.request.use(
  async config => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected || !netState.isInternetReachable) {
      store.dispatch(updateNetwork())
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Network error
      store.dispatch(updateNetwork())
    } else if (error.response.status === 401) {
      // Token expired or unauthorized
      console.log('Unauthorized');
      // Optionally trigger logout
    }
    return Promise.reject(error);
  }
);

export default api;
