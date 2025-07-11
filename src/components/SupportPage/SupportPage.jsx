// components/SupportPage/SupportPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './SupportPage.css'; // Create this CSS file
import paypalLogo from './assets/paypal.png'; // Add these images to your assets
import binanceLogo from './assets/binance.png';
import cihLogo from './assets/cih.png';

function SupportPage({ onBack }) {
  const { t } = useTranslation();

  return (
    <div className="support-page">
      <button onClick={onBack} className="back-button">
        ← {t('backToMenu')}
      </button>
      
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