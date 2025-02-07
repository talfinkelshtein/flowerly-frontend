import React from 'react';
import Login from '../../components/login/LoginCard';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  return (
    <div className="login-container">
      <Login />
    </div>
  );
};

export default LoginPage;
