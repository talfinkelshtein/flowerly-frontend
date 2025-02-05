import { CredentialResponse } from '@react-oauth/google';
import { createContext, useContext, useState } from 'react';
import { googleSignin, loginUser } from '../services/UserService';
import { LoggedUserInfo, LoginRequirements } from '../types/AuthTypes';

interface AuthContextType {
  userToken: string | null;
  login: (userData: LoginRequirements) => Promise<Response>;
  googleLogin: (credentialResponse: CredentialResponse) => Promise<Response>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  login: async () =>
    new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }),
  googleLogin: async () =>
    new Response(JSON.stringify({ message: 'Google login failed' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUser] = useState(() => localStorage.getItem('accessToken') || null);

  const login = async (userData: LoginRequirements): Promise<Response> => {
    try {
      const res = await loginUser(userData.email, userData.password);
      if (res.status === 200) {
        const loggedUser = await res.json();
        setUser(loggedUser);
        await setUserAccessToken(loggedUser);
      }
      return res;
    } catch (error) {
      console.error('Login error:', error);
      return new Response(JSON.stringify({ message: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };

  const googleLogin = async (credentialResponse: CredentialResponse): Promise<Response> => {
    try {
      const res = await googleSignin(credentialResponse);
      if (res.status === 200) {
        const loggedUser = await res.json();
        setUser(loggedUser);
        await setUserAccessToken(loggedUser);
      }
      return res;
    } catch (error) {
      console.error('Google login error:', error);
      return new Response(JSON.stringify({ message: 'Google login failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  };

  const setUserAccessToken = async ({ accessToken, refreshToken, _id }: LoggedUserInfo) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', _id);
  };

  return <AuthContext.Provider value={{ userToken, login, googleLogin, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
