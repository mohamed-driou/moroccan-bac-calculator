import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BacCalculator.module.css';

const CalculatorForm = ({ mode, inputs, setInputs, calculate }) => {
  const { t } = useTranslation();

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    
    // Regex: Allows 0-20 with optional 1-2 decimals
    const isValid = /^(20(\.0{0,2})?|([0-1]?[0-9])(\.[0-9]{0,2})?)$/.test(value);
    
    // Auto-correct .5 to 0.5
    const sanitizedValue = value.startsWith('.') ? `0${value}` : value;
    
    if (value === '' || isValid) {
      setInputs({ ...inputs, [field]: sanitizedValue });
    }
  };

  const isInputValid = (value) => {
    if (value === '') return false;
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 20;
  };

  return (
    <div className={styles.calculatorForm}>
      {/* Regional Exam (25%) */}
      <div className={styles.inputGroup}>
        <label>{t('calculator.regionalExam')} (25%) :</label>
        <input
          type="text"
          inputMode="decimal"
          value={inputs.regional}
          onChange={(e) => handleInputChange(e, 'regional')}
          className={`${styles.inputField} ${
            inputs.regional && !isInputValid(inputs.regional) ? styles.invalid : ''
          }`}
          placeholder={t('calculator.inputPlaceholder')}
        />
        {inputs.regional && !isInputValid(inputs.regional) && (
          <p className={styles.errorText}>{t('calculator.validationError')}</p>
        )}
      </div>

      {/* Continuous Assessment (25%) */}
      <div className={styles.inputGroup}>
        <label>{t('calculator.continuousAssessment')} (25%) :</label>
        <input
          type="text"
          inputMode="decimal"
          value={inputs.continuous}
          onChange={(e) => handleInputChange(e, 'continuous')}
          className={`${styles.inputField} ${
            inputs.continuous && !isInputValid(inputs.continuous) ? styles.invalid : ''
          }`}
          placeholder={t('calculator.inputPlaceholder')}
        />
        {inputs.continuous && !isInputValid(inputs.continuous) && (
          <p className={styles.errorText}>{t('calculator.validationError')}</p>
        )}
      </div>

      {/* Conditional Fields */}
      {mode === 'average' && (
        <div className={styles.inputGroup}>
          <label>{t('calculator.nationalExam')} (50%) :</label>
          <input
            type="text"
            inputMode="decimal"
            value={inputs.national}
            onChange={(e) => handleInputChange(e, 'national')}
            className={`${styles.inputField} ${
              inputs.national && !isInputValid(inputs.national) ? styles.invalid : ''
            }`}
            placeholder={t('calculator.inputPlaceholder')}
          />
          {inputs.national && !isInputValid(inputs.national) && (
            <p className={styles.errorText}>{t('calculator.validationError')}</p>
          )}
        </div>
      )}

      {mode === 'needed' && (
        <div className={styles.inputGroup}>
          <label>{t('calculator.targetBac')} :</label>
          <input
            type="text"
            inputMode="decimal"
            value={inputs.target}
            onChange={(e) => handleInputChange(e, 'target')}
            className={`${styles.inputField} ${
              inputs.target && !isInputValid(inputs.target) ? styles.invalid : ''
            }`}
            placeholder={t('calculator.inputPlaceholder')}
          />
          {inputs.target && !isInputValid(inputs.target) && (
            <p className={styles.errorText}>{t('calculator.validationError')}</p>
          )}
        </div>
      )}

      {mode === 'minimum' && (
        <div className={styles.inputGroup}>
          <label>{t('calculator.bacAverageFixed')} (50%)</label>
          <div className={styles.fixedValueContainer}>
            10.00/20
          </div>
          <p className={styles.hintText}>{t('calculator.passingGrade')}</p>
        </div>
      )}

      <button 
        className={styles.calculateButton} 
        onClick={calculate}
        disabled={
          mode === 'minimum' 
            ? !isInputValid(inputs.regional) || !isInputValid(inputs.continuous)
            : mode === 'needed'
            ? !isInputValid(inputs.regional) || !isInputValid(inputs.continuous) || !isInputValid(inputs.target)
            : !isInputValid(inputs.regional) || !isInputValid(inputs.continuous) || !isInputValid(inputs.national)
        }
      >
        {t('calculator.calculateButton')}
      </button>
    </div>
  );
};

export default CalculatorForm;