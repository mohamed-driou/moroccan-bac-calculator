import React from 'react';
import styles from './MainMenu.module.css';

const MainMenu = ({ onSelectCalculator }) => {
  return (
    <div className="menu-container">
      <h1 className="menu-title">Moroccan Bac Calculator</h1>
      
      <div className="menu-options">
        <button 
          className="menu-card" 
          onClick={() => onSelectCalculator('stream')}
        >
          <h2>Bac Average by Stream</h2>
          <p>Calculate your average based on your branch (Science/Adab).</p>
        </button>

        <button 
          className="menu-card" 
          onClick={() => onSelectCalculator('formula')}
        >
          <h2>Bac Formula Calculator</h2>
          <p>Calculate scores needed for target averages.</p>
        </button>
      </div>
    </div>
  );
};

export default MainMenu;