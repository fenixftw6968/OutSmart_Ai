import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('outsmart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const registerApi = (data) => API.post('/auth/register', data);
export const loginApi = (data) => API.post('/auth/login', data);
export const getMeApi = () => API.get('/users/me');

// Game endpoints
export const startGameApi = (data) => API.post('/games/start', data);
export const getGameApi = (id) => API.get(`/games/${id}`);
export const requestHintApi = (id) => API.post(`/games/${id}/hint`);
export const submitGameApi = (id, data) => API.post(`/games/${id}/submit`, data);

// Leaderboard & Stats endpoints
export const getGlobalLeaderboardApi = () => API.get('/leaderboard/global');
export const getWeeklyLeaderboardApi = () => API.get('/leaderboard/weekly');
export const getDailyLeaderboardApi = () => API.get('/leaderboard/daily');
export const getLiveStatsApi = () => API.get('/stats/live');
export const getDailyChallengeApi = () => API.get('/daily-challenge');
export const getPublicResultApi = (id) => API.get(`/results/${id}`);

export default API;
