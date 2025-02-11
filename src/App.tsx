import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styles from './App.module.css';
import { AuthProvider } from './contexts/AuthContext';
import EditPostPage from './pages/EditPostPage/EditPostPage';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import PostPage from './pages/PostPage/PostPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import UploadPostPage from './pages/UploadPostPage/UploadPostPage';
import Navbar from './components/NavBar/Navbar';
import ProfilePage from './pages/ProfilePage/ProfilePage';

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/upload" element={<UploadPostPage />} />
            <Route path="/post/:postId" element={<PostPage />} />
            <Route path="/edit/:postId" element={<EditPostPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
