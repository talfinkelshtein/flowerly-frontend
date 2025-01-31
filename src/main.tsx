import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='971005664793-temc8560umpfanormjketp91k35sbj6g.apps.googleusercontent.com'>
    <StrictMode>
      <App></App>
    </StrictMode>
  </GoogleOAuthProvider>
);
