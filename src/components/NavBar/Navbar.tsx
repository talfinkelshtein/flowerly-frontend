import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <nav className="navbar">
            <h2 className="logo"><Link to="/">Flowerly App</Link></h2>
            <ul>
                <li><Link to="/">Home</Link></li>

                {isLoggedIn ? (
                    <>
                        <li><Link to="/upload">Upload Post</Link></li>
                        <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
