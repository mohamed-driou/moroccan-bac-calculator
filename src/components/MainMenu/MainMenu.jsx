import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MainMenu.module.css';

const MainMenu = ({ onSelectCalculator }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="menu-container">
      {/* Language Switcher */}
      <div className={styles.languageSwitcher}>
        <select
          value={i18n.language}
          onChange={changeLanguage}
          className={styles.languageSelect}
        >
          <option value="en">🇬🇧 English</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="ar">🇲🇦 العربية</option>
        </select>
      </div>

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
    </div>
  );
};

export default MainMenu;
