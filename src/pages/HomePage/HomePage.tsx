import React from 'react';
import styles from './HomePage.module.css';
import Feed from '../../components/Feed/Feed';

const HomePage: React.FC = () => {
    return (
        <div className={styles.homeContainer}>
            <Feed />
        </div>
    );
};

export default HomePage;
