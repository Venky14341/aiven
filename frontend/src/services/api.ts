import axios from 'axios';
import { ResearchReport } from '../types';
import { authService } from './authService';

const api = axios.create({
  baseURL: '/api',
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

// No-op interceptor response handler since auth is disabled
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const submitResearch = async (companyName: string): Promise<ResearchReport> => {
  const response = await api.post('/research', { companyName });
  return response.data;
};

export const getReport = async (companyName: string): Promise<ResearchReport> => {
  const response = await api.get(`/report/${encodeURIComponent(companyName)}`);
  return response.data;
};
