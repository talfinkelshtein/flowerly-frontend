import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton, Typography } from "@mui/material";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./Navbar.module.css";
import { useAuth } from "../../contexts/AuthContext";

const Navbar: React.FC = () => {
    const { userToken, logout } = useAuth();

    return (
        <AppBar position="sticky" className={styles.navbar}>
            <Toolbar className={styles.toolbar}>
                <IconButton component={Link} to="/" className={styles.logo}>
                    <LocalFloristIcon className={styles.icon} />
                    <Typography variant="h6" className={styles.logoText}>Flowerly</Typography>
                </IconButton>

                <div className={styles.navLinks}>
                    <Button component={Link} to="/" className={styles.navButton}>Home</Button>

                    {userToken ? (
                        <>
                            <Button component={Link} to="/upload" className={styles.navButton}>Upload Post</Button>
                            <Button component={Link} to="/profile" className={styles.navButton}>
                                <AccountCircleIcon sx={{ marginRight: 1 }} />
                                Profile
                            </Button>
                            <Button onClick={logout} className={styles.navButton}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button component={Link} to="/register" className={styles.navButton}>Register</Button>
                            <Button component={Link} to="/login" className={styles.navButton}>Login</Button>
                        </>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
