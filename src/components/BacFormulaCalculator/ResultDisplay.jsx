import React from 'react';


const ResultDisplay = ({ result }) => {
  const getResultText = () => {
    switch(result.type) {
      case 'average':
        return `Bac Average: ${result.value}/20`;
      case 'needed':
        return `Required National Exam Score: ${result.value}/20`;
      case 'minimum':
        return `Minimum National Exam Score: ${result.value}/20`;
      default:
        return '';
    }
  };

  return (
    <div className="result-container">
      <h3>Result:</h3>
      <div className="result-value">
        {getResultText()}
      </div>
    </div>
  );
};

export default ResultDisplay;