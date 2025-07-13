import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const { t } = useTranslation();
  
  return (
    <div className="contact-page">
      <h1>{t('contact.title')}</h1>
      
      <div className="contact-methods">
        <div className="contact-card">
          <h3>{t('contact.email')}</h3>
          <a href="mailto:mohamedadriou3@gmail.com">mohamedadriou3@gmail.com</a>
        </div>
        
        <div className="contact-card">
          <h3>{t('contact.socialMedia')}</h3>
          <div className="social-links">
            <a href="https://www.facebook.com/SimO.ADriiOu" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.instagram.com/adriiou_simo/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://github.com/mohamed-driou" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>
      
      <Link to="/" className="home-link">
        {t('common.backToHome')}
      </Link>
    </div>
  );
};

export default Contact;