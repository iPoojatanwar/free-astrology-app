
import axios from 'axios';

const ASTRO_URL =
  'https://jagannatha-hora-359167915530.europe-west1.run.app';

const astrologyApi = axios.create({
  baseURL: ASTRO_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateBirthChart = async (data) => {
  const response = await astrologyApi.post('/horoscope', {
    date: data.date,
    time: data.time,
    place: data.place,
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    timezone: Number(data.timezone),
  });

  return response.data;
};

export const generateKundliMatching = async (data) => {
  const response = await astrologyApi.post('/marriage-match', {
    boy_birth_details: data.boy_birth_details,
    girl_birth_details: data.girl_birth_details,
  });

  return response.data;
};

export const generatePanchang = async (data) => {
  const response = await astrologyApi.post('/panchang', {
    date: data.date,
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    timezone: Number(data.timezone),
    place: data.place || '',
  });

  return response.data;
};
