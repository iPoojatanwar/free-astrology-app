
import axios from 'axios';
import api from './api';

const BASE_URL =
  'https://jagannatha-hora-359167915530.europe-west1.run.app';

const astrologyApi = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

// Location Search
export const searchLocation = async (query) => {
  const { data } = await astrologyApi.get('/location/search', {
    params: { query },
  });

  return data;
};

// Birth Chart
export const getBirthChart = async (details) => {
  const { data } = await api.post('/reports/birth-chart', details);
  return data;
};

// Kundli Matching
export const getKundliMatch = async (details) => {
  const { data } = await api.post('/reports/kundli-matching', details);
  return data;
};

// Panchang
export const getPanchang = async (details) => {
  const { data } = await api.post('/reports/panchang', details);
  return data;
};
