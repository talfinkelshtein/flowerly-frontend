import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import UploadPostPage from "./pages/UploadPostPage/UploadPostPage";
import Navbar from "./components/Navbar/Navbar";
import styles from "./App.module.css";
import PostPage from "./pages/PostPage/PostPage";
import EditPostPage from "./pages/EditPostPage/EditPostPage";

const App: React.FC = () => {
    return (
        <div className={styles.appContainer}>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/upload" element={<UploadPostPage />} />
                    <Route path="/post/:postId" element={<PostPage />} />
                    <Route path="/edit/:postId" element={<EditPostPage />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
