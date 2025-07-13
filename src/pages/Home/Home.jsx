import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  
  return (
    <div className="home-page">
      <header>
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
      </header>
      
      <main>
        <section className="cta-section">
          <Link to="/how-to-use" className="cta-button how-to-use-btn">
            {t('home.howToUse')}
          </Link>
          <Link to="/calculator" className="cta-button primary">
            {t('home.useCalculator')}
          </Link>
          <Link to="/stream-calculator" className="cta-button stream-calculator-btn">
            {t('home.useStreamCalculator')}
          </Link>
        </section>
        
        <section className="features">
          <h2>{t('home.featuresTitle')}</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>{t('home.feature1.title')}</h3>
              <p>{t('home.feature1.description')}</p>
            </div>
            <div className="feature-card">
              <h3>{t('home.feature2.title')}</h3>
              <p>{t('home.feature2.description')}</p>
            </div>
            <div className="feature-card">
              <h3>{t('home.feature3.title')}</h3>
              <p>{t('home.feature3.description')}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;