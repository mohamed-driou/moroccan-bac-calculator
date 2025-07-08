import React from 'react';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ steps, currentStep, selectedValues, branch1, branch2 }) => {
  // Special handling only for traditional branch
  const isTraditional = branch1 === "traditional";

  // Get the display text for a step
  const getDisplayText = (step, index) => {
    if (step.valueKey === 'branch2' && branch2) {
      return selectedValues.branch2 || step.label;
    }
    return (step.valueKey && selectedValues[step.valueKey] && index < currentStep)
      ? selectedValues[step.valueKey]
      : step.label;
  };

  return (
    <nav aria-label="Progress steps" className={styles.breadcrumbs}>
      <div className={styles.track}>
        {steps.map((step, index) => {
          if (index > currentStep) return null;

          // Special handling only for Traditional Education
          if (isTraditional) {
            const reorderedSteps = [
              steps[0], // Student Type
              steps[1], // Branch
              steps[3], // Track
              steps[2], // Regional Exam
              ...(steps.length > 4 ? steps.slice(4) : [])
            ];
            const displayStep = reorderedSteps[index];
            return (
              <React.Fragment key={index}>
                {index > 0 && <span className={styles.divider}>/</span>}
                <span className={`${styles.step} ${index === currentStep ? styles.current : styles.completed}`}>
                  {getDisplayText(displayStep, index)}
                </span>
              </React.Fragment>
            );
          }

          // Default behavior for all other branches (including adab)
          return (
            <React.Fragment key={index}>
              {index > 0 && <span className={styles.divider}>/</span>}
              <span className={`${styles.step} ${index === currentStep ? styles.current : styles.completed}`}>
                {getDisplayText(step, index)}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumbs;