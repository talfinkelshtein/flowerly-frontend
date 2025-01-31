import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Register from './components/registration/RegisterCard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ display: 'flex', flexDirection: 'column'}}>
      <Register></Register>
    </div>
  </StrictMode>
);
