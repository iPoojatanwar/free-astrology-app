
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 60000,
});

export const errMsg = (error) =>
  error.response?.data?.message ||
  error.response?.data?.detail ||
  error.message ||
  'Something went wrong';

export default api;
