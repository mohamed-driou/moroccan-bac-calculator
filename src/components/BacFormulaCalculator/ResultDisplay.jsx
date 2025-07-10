import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ResultDisplay.module.css'; // Assuming you'll create this CSS module

const ResultDisplay = ({ result }) => {
  const { t } = useTranslation();

  const getResultText = () => {
    if (!result) return null;

    switch(result.type) {
      case 'average':
        return t('resultDisplay.bacAverage', { value: result.value });
      case 'needed':
        return t('resultDisplay.requiredNationalExam', { value: result.value });
      case 'minimum':
        return t('resultDisplay.minimumNationalExam', { value: result.value });
      default:
        return '';
    }
  };

  return (
    <div className={styles.resultContainer}>
      <h3>{t('resultDisplay.resultTitle')}</h3>
      <div className={styles.resultValue}>
        {getResultText()}
      </div>
    </div>
  );
};

export default ResultDisplay;