import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  
  return (
    <div className="privacy-page">
      <h1>{t('privacy.title')}</h1>
      
      <div className="privacy-content">
        <section>
          <h2>{t('privacy.section1.title')}</h2>
          <p>{t('privacy.section1.content')}</p>
        </section>
        
        <section>
          <h2>{t('privacy.section2.title')}</h2>
          <p>{t('privacy.section2.content')}</p>
        </section>
        
        <section>
          <h2>{t('privacy.section3.title')}</h2>
          <p>{t('privacy.section3.content')}</p>
        </section>
      </div>
      
      <Link to="/" className="home-link">
        {t('common.backToHome')}
      </Link>
    </div>
  );
};

export default PrivacyPolicy;