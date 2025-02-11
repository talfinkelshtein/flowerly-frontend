import { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { config } from '../config';
import { UserProfileServerResponse } from '../types/AuthTypes';

export const registerUser = async (formData: FormData) => {
  try {
    return await axios.post(config.AUTH_REGISTER, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const googleSignin = async (credentialResponse: CredentialResponse): Promise<Response> => {
  try {
    return await fetch(config.AUTH_GOOGLE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentialResponse),
    });
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    return await fetch(config.AUTH_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

export const setUserAccessToken = async (response: Response) => {
  const { accessToken, refreshToken, _id } = await response.json();
  if (response.status === 200) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', _id);
  }
};

export const getUserId = (): string => localStorage.getItem('userId') ?? '';

export const getUserAccessToken = (): string => localStorage.getItem('accessToken') ?? '';

export const getCurrentUserProfile = async (): Promise<UserProfileServerResponse> => {
  const userId = getUserId();
  const token = getUserAccessToken();

  if (!token) throw new Error('No authentication token found');

  try {
    const response = await axios.get(config.USER_PROFILE(userId), {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, formData: FormData) => {
  const token = getUserAccessToken();
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await axios.put(config.USER_PROFILE(userId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
