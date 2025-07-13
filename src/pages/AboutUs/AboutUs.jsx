import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <h1>{t('about.title')}</h1>

      <div className="about-content">
        <section>
          <h2>{t('about.developerTitle')}</h2>
          <p>{t('about.developerText')}</p>
        </section>

        <section>
          <h2>{t('about.whyTitle')}</h2>
          <p>{t('about.whyText')}</p>
        </section>

        <section>
          <h2>{t('about.visionTitle')}</h2>
          <p>{t('about.visionText')}</p>
        </section>

        <section>
          <h2>{t('about.contactTitle')}</h2>
          <p>
            {t('about.contactText')}
            <a href={`mailto:${t('about.contactEmail')}`}>
              {t('about.contactEmail')}
            </a>
          </p>
        </section>
      </div>

      <Link to="/" className="home-link">
        {t('common.backToHome')}
      </Link>
    </div>
  );
};

export default AboutUs;