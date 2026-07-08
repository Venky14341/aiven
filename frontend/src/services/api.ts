import axios from 'axios';
import { ResearchReport } from '../types';
import { authService } from './authService';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  timeout: 120000,
});

// Attach JWT token to every outgoing request
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — auto-logout and reload to login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const submitResearch = async (companyName: string): Promise<ResearchReport> => {
  const response = await api.post('/research', { companyName });
  return response.data;
};

export const getReport = async (companyName: string): Promise<ResearchReport> => {
  const response = await api.get(`/report/${encodeURIComponent(companyName)}`);
  return response.data;
};
