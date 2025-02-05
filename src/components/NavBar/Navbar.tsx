import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <nav className={styles.navbar}>
            <h2 className={styles.logo}><Link to="/">Flowerly App</Link></h2>
            <ul className={styles.navList}>
                <li><Link to="/">Home</Link></li>

                {isLoggedIn ? (
                    <>
                        <li><Link to="/upload">Upload Post</Link></li>
                        <li><button className={styles.logoutBtn} onClick={handleLogout}>Logout</button></li>
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
