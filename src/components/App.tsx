import React from 'react';
import './App.css';
import Feed from './feed/Feed';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Flowerly</h1>
      </header>
      <main className="app-content">
        <Feed />
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 Flowerly App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
