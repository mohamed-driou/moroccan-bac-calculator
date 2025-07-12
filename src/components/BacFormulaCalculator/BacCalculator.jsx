import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BacCalculator.module.css';
import CalculatorForm from './CalculatorForm';
import ResultDisplay from './ResultDisplay';

const BacCalculator = ({ onBack }) => {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState('average');
  const [result, setResult] = useState(null);
  const [inputs, setInputs] = useState({
    regional: '',
    national: '',
    continuous: '',
    target: ''
  });
  const [error, setError] = useState('');

  const changeLanguage = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const calculate = () => {
    setError('');
    const { regional, national, continuous, target } = inputs;
    const regionalScore = parseFloat(regional) || 0;
    const continuousScore = parseFloat(continuous) || 0;

    if (mode === 'average') {
      const nationalScore = parseFloat(national) || 0;
      const average = (nationalScore * 0.5) + (regionalScore * 0.25) + (continuousScore * 0.25);
      setResult({
        type: 'average',
        value: Math.min(20, average).toFixed(2)
      });
    } 
    else if (mode === 'needed') {
      const targetScore = parseFloat(target) || 0;
      const needed = (targetScore - (regionalScore * 0.25 + continuousScore * 0.25)) / 0.5;

      if (needed < 0.01 || needed > 20.00) {
        setError(t('calculator.errors.impossibleScore'));
        setResult(null);
        return;
      }

      setResult({
        type: 'needed',
        value: needed.toFixed(2)
      });
    }
    else if (mode === 'minimum') {
      const minimum = (10 - (regionalScore * 0.25 + continuousScore * 0.25)) / 0.5;
      setResult({
        type: 'minimum',
        value: Math.min(20, Math.max(0, minimum)).toFixed(2)
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          {t('buttons.back')}
        </button>
        
        <h1 className={styles.title}>{t('calculator.title')}</h1>
        
        {/* Empty div for spacing */}
        <div style={{ width: '48px' }}></div>
      </div>

      {/* Language Switcher */}

      
      <div className={styles.modeSelector}>
        {['average', 'needed', 'minimum'].map((modeType) => (
          <button
            key={modeType}
            className={`${styles.modeButton} ${mode === modeType ? styles.active : ''}`}
            onClick={() => {
              setMode(modeType);
              setResult(null);
              setError('');
            }}
          >
            {t(`calculator.modes.${modeType}`)}
          </button>
        ))}
      </div>

      <CalculatorForm 
        mode={mode} 
        inputs={inputs}
        setInputs={setInputs}
        calculate={calculate}
      />

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default BacCalculator;