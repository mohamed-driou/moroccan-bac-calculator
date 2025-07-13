import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import "./HowToUse.css";

const HowToUse = () => {
  const { t } = useTranslation();
  
  return (
    <div className="how-to-use">
      <header>
        <h1>{t('howToUse.title')}</h1>
      </header>
      
      <main>
        <section className="intro">
          <h2>{t('howToUse.introTitle')}</h2>
          <p>{t('howToUse.introText')}</p>
        </section>
        
        <section className="steps">
          <h2>{t('howToUse.stepsTitle')}</h2>
          <ol className="steps-list">
            <li>{t('howToUse.step1')}</li>
            <li>{t('howToUse.step2')}</li>
            <li>{t('howToUse.step3')}</li>
            <li>{t('howToUse.step4')}</li>
          </ol>
        </section>
        
        <section className="target-audience">
          <h2>{t('howToUse.audienceTitle')}</h2>
          <ul>
            <li>{t('howToUse.audience1')}</li>
            <li>{t('howToUse.audience2')}</li>
            <li>{t('howToUse.audience3')}</li>
          </ul>
        </section>
        
        <div className="cta">
          <Link to="/calculator" className="calculator-button primary">
            {t('howToUse.goToCalculator')}
          </Link>
          <Link to="/stream-calculator" className="calculator-button secondary">
            {t('howToUse.goToStreamCalculator')}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HowToUse;