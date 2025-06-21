import React, { useState } from 'react';
import styles from './BacCalculator.module.css';
import CalculatorForm from './CalculatorForm';
import ResultDisplay from './ResultDisplay';

const BacCalculator = ({ onBack }) => {
  const [mode, setMode] = useState('average');
  const [result, setResult] = useState(null);
  const [inputs, setInputs] = useState({
    regional: '',
    national: '',
    continuous: '',
    target: ''
  });
  const [error, setError] = useState('');

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
        setError('Attention: It is impossible to obtain this score - try different values');
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
      <button onClick={onBack} className={styles.backButton}>
        ← Back to Menu
      </button>
      
      <h1 className={styles.title}>Baccalaureate Formula Calculator</h1>
      
      <div className={styles.modeSelector}>
        <button
          className={`${styles.modeButton} ${mode === 'average' ? styles.active : ''}`}
          onClick={() => {
            setMode('average');
            setResult(null);
            setError('');
          }}
        >
          Calculate Average
        </button>
        <button
          className={`${styles.modeButton} ${mode === 'needed' ? styles.active : ''}`}
          onClick={() => {
            setMode('needed');
            setResult(null);
            setError('');
          }}
        >
          Score Needed
        </button>
        <button
          className={`${styles.modeButton} ${mode === 'minimum' ? styles.active : ''}`}
          onClick={() => {
            setMode('minimum');
            setResult(null);
            setError('');
          }}
        >
          Minimum Score
        </button>
      </div>

      <CalculatorForm 
        mode={mode} 
        inputs={inputs}
        setInputs={setInputs}
        calculate={calculate}
      />

      {/* Single error message location */}
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