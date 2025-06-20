import React from 'react';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ steps, currentStep, selectedValues }) => {
  return (
    <nav aria-label="Progress steps" className={styles.breadcrumbs}>
      <div className={styles.track}>
        {steps.map((step, index) => {
          if (index > currentStep) return null;
          
          // Determine what to display
          const displayText = (step.valueKey && selectedValues[step.valueKey] && index < currentStep)
            ? selectedValues[step.valueKey] // Show just the selected value for completed steps
            : step.label; // Show the step label for current and upcoming steps
          
          return (
            <React.Fragment key={index}>
              {index > 0 && <span className={styles.divider}>/</span>}
              
              <span
                className={`${styles.step} ${
                  index === currentStep ? styles.current : styles.completed
                }`}
              >
                {displayText}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumbs;