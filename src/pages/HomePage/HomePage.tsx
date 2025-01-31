import React from 'react';
import './HomePage.css';
import Feed from '../../components/Feed/Feed';

const HomePage: React.FC = () => {
    return (
        <div className="home-container">
            <Feed />
        </div>
    );
};

export default HomePage;