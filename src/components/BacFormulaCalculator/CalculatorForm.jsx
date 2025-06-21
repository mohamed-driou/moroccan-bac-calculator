import React from 'react';
import styles from './BacCalculator.module.css';

const CalculatorForm = ({ mode, inputs, setInputs, calculate }) => {
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
        <label>Regional Exam Score (25%)</label>
        <input
          type="text"
          inputMode="decimal"
          value={inputs.regional}
          onChange={(e) => handleInputChange(e, 'regional')}
          className={`${styles.inputField} ${
            inputs.regional && !isInputValid(inputs.regional) ? styles.invalid : ''
          }`}
          placeholder="0.00 - 20.00"
        />
        {inputs.regional && !isInputValid(inputs.regional) && (
          <p className={styles.errorText}>Must be between 0.00 and 20.00</p>
        )}
      </div>

      {/* Continuous Assessment (25%) */}
      <div className={styles.inputGroup}>
        <label>Continuous Assessment (25%)</label>
        <input
          type="text"
          inputMode="decimal"
          value={inputs.continuous}
          onChange={(e) => handleInputChange(e, 'continuous')}
          className={`${styles.inputField} ${
            inputs.continuous && !isInputValid(inputs.continuous) ? styles.invalid : ''
          }`}
          placeholder="0.00 - 20.00"
        />
        {inputs.continuous && !isInputValid(inputs.continuous) && (
          <p className={styles.errorText}>Must be between 0.00 and 20.00</p>
        )}
      </div>

      {/* Conditional Fields */}
      {mode === 'average' && (
        <div className={styles.inputGroup}>
          <label>National Exam Score (50%)</label>
          <input
            type="text"
            inputMode="decimal"
            value={inputs.national}
            onChange={(e) => handleInputChange(e, 'national')}
            className={`${styles.inputField} ${
              inputs.national && !isInputValid(inputs.national) ? styles.invalid : ''
            }`}
            placeholder="0.00 - 20.00"
          />
          {inputs.national && !isInputValid(inputs.national) && (
            <p className={styles.errorText}>Must be between 0.00 and 20.00</p>
          )}
        </div>
      )}

      {mode === 'needed' && (
        <div className={styles.inputGroup}>
          <label>Target Bac Average</label>
          <input
            type="text"
            inputMode="decimal"
            value={inputs.target}
            onChange={(e) => handleInputChange(e, 'target')}
            className={`${styles.inputField} ${
              inputs.target && !isInputValid(inputs.target) ? styles.invalid : ''
            }`}
            placeholder="0.00 - 20.00"
          />
          {inputs.target && !isInputValid(inputs.target) && (
            <p className={styles.errorText}>Must be between 0.00 and 20.00</p>
          )}
        </div>
      )}

      {mode === 'minimum' && (
        <div className={styles.inputGroup}>
          <label>Baccalaureate Average (Fixed)</label>
          <div className={styles.fixedValueContainer}>
            10.00/20
          </div>
          <p className={styles.hintText}>Passing grade (fixed value)</p>
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
        Calculate
      </button>
    </div>
  );
};

export default CalculatorForm;