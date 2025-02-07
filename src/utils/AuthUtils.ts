import { jwtDecode } from 'jwt-decode';
import { config } from '../config';

interface DecodedToken {
  exp: number;
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Invalid token:', error);
    return true;
  }
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
    });

    if (response.status === 401) {
      alert('Session expired, please log in again.');
      return null;
    }

    if (!response.ok) {
      console.error('Failed to refresh token');
      return null;
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};
