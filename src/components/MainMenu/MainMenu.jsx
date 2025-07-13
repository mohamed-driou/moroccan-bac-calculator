import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import './MainMenu.css';

const MainMenu = ({ onSelectCalculator }) => {
  const { t } = useTranslation();

  return (
    <div className="main-menu">
      {/* Navigation Links */}
      <nav className="main-nav">
        <NavLink 
          to="/" 
          className="nav-link"
          activeClassName="active"
          exact
        >
          {t('menu.home')}
        </NavLink>
        
        <NavLink 
          to="/how-to-use" 
          className="nav-link"
          activeClassName="active"
        >
          {t('menu.howToUse')}
        </NavLink>
        
        <NavLink 
          to="/calculator" 
          className="nav-link"
          activeClassName="active"
        >
          {t('menu.calculator')}
        </NavLink>
        
        <NavLink 
          to="/stream-calculator" 
          className="nav-link"
          activeClassName="active"
        >
          {t('menu.streamCalculator')}
        </NavLink>
        
        <NavLink 
          to="/contact" 
          className="nav-link"
          activeClassName="active"
        >
          {t('menu.contact')}
        </NavLink>
        
        <NavLink 
          to="/about" 
          className="nav-link"
          activeClassName="active"
        >
          {t('menu.about')}
        </NavLink>
        
        <NavLink 
          to="/privacy" 
          className="nav-link"
          activeClassName="active"
        >
          {t('menu.privacy')}
        </NavLink>
        
        <NavLink 
          to="/support" 
          className="nav-link"
          activeClassName="active"
        >
          {t('menu.support')}
        </NavLink>
      </nav>

      {/* Calculator Selection Section */}
      {onSelectCalculator && (
        <>
          <h1 className="menu-title">{t('mainMenu.title')}</h1>
          <div className="menu-options">
            <button
              className="menu-card"
              onClick={() => onSelectCalculator('stream')}
            >
              <h2>{t('mainMenu.byStream.title')}</h2>
              <p>{t('mainMenu.byStream.description')}</p>
            </button>

            <button
              className="menu-card"
              onClick={() => onSelectCalculator('formula')}
            >
              <h2>{t('mainMenu.byFormula.title')}</h2>
              <p>{t('mainMenu.byFormula.description')}</p>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MainMenu;