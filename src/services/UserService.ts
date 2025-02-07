import { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { config } from '../config';

export const registerUser = async (email: string, password: string): Promise<Response> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const googleSignin = async (credentialResponse: CredentialResponse): Promise<Response> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentialResponse),
    });
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response;
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

export const getUserAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getUserProfile = async (userId: string) => {
  const token = getUserAccessToken();

  if (!token) throw new Error("No authentication token found");

  try {
    const response = await axios.get(`${config.API_BASE_URL}/users/${userId}`, {
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

  if (!token) throw new Error("No authentication token found");
  try {
    console.log("Sending update request with:", formData);
    console.log(formData.get("image"));
    const response = await axios.put(`${config.API_BASE_URL}/users/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("✅ Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
