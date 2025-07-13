// components/SupportPage/SupportPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './SupportPage.css';
import paypalLogo from './assets/paypal.png';
import binanceLogo from './assets/binance.png';
import cihLogo from './assets/cih.png';

function SupportPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    console.log('Back button clicked'); // Debugging
    navigate(-1); // Go back in history
    // OR navigate('/'); // To always go home
  };

  return (
    <div className="support-page">
      
      
      <h2>{t('support.title')}</h2>
      <p>{t('support.description')}</p>
      
      <div className="donation-methods">
        <div className="donation-method">
          <img src={paypalLogo} alt="PayPal" className="donation-logo" />
          <h3>PayPal</h3>
          <p>https://paypal.me/adriou</p>
          <a href="https://paypal.me/adriou" target="_blank" rel="noopener noreferrer" className="donate-link">
            {t('support.donateNow')}
          </a>
        </div>
        
        <div className="donation-method">
          <img src={binanceLogo} alt="Binance" className="donation-logo" />
          <h3>Binance</h3>
          <p>ID: 814551613</p>
        </div>
        
        <div className="donation-method">
          <img src={cihLogo} alt="CIH" className="donation-logo" />
          <h3>CIH Bank</h3>
          <p>RIB: 5619934211025700</p>
        </div>
      </div>
      
      <p className="thank-you">{t('support.thankYou')}</p>
    </div>
  );
}

export default SupportPage;