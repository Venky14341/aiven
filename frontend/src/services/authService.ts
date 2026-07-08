import axios from 'axios';

const BASE_URL = '/api/auth';

const TOKEN_KEY = 'aivenky_token';
const USER_KEY = 'aivenky_user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
  message: string;
}

export const authService = {
  /** Register a new account */
  async register(name: string, email: string, password: string): Promise<AuthUser> {
    const { data } = await axios.post<AuthResponse>(`${BASE_URL}/register`, { name, email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  /** Login with existing account */
  async login(email: string, password: string): Promise<AuthUser> {
    const { data } = await axios.post<AuthResponse>(`${BASE_URL}/login`, { email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  /** Demo login (no credentials needed) */
  async demoLogin(): Promise<AuthUser> {
    const { data } = await axios.post<AuthResponse>(`${BASE_URL}/demo`);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  /** Clear session */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /** Get the stored JWT token */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /** Get the stored user (parsed from localStorage) */
  getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  /** Check if a token exists (basic client-side check) */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
