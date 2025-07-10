import React from 'react';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ steps = [], currentStep = 0, selectedValues = {}, branch1 = '', branch2 = '' }) => {
  // Validate props
  if (!Array.isArray(steps)) {
    console.error("Breadcrumbs: 'steps' prop must be an array");
    return null;
  }

  if (typeof currentStep !== 'number' || currentStep < 0) {
    console.error("Breadcrumbs: 'currentStep' must be a positive number");
    return null;
  }

  // Get the display text for a step
  const getDisplayText = (step, index) => {
    if (!step) return '';
    
    if (step.valueKey === 'branch2' && branch2) {
      return selectedValues.branch2 || step.label;
    }
    
    return (step.valueKey && selectedValues[step.valueKey] && index < currentStep)
      ? selectedValues[step.valueKey]
      : step.label;
  };

  // Special handling only for traditional branch
  const isTraditional = branch1 === "traditional";

  // Create reordered steps for traditional education
  const getTraditionalSteps = () => {
    try {
      return [
        steps[0], // Student Type
        steps[1], // Branch
        steps[3], // Track
        steps[2], // Regional Exam
        ...(steps.length > 4 ? steps.slice(4) : [])
      ].filter(Boolean); // Filter out any undefined steps
    } catch (e) {
      console.error("Error reordering traditional steps:", e);
      return steps;
    }
  };

  const renderStep = (step, index) => {
    if (!step || index > currentStep) return null;

    return (
      <React.Fragment key={index}>
        {index > 0 && <span className={styles.divider}>/</span>}
        <span 
          className={`${styles.step} ${
            index === currentStep ? styles.current : styles.completed
          }`}
          aria-current={index === currentStep ? "step" : undefined}
        >
          {getDisplayText(step, index)}
        </span>
      </React.Fragment>
    );
  };

  return (
    <nav aria-label="Progress steps" className={styles.breadcrumbs}>
      <div className={styles.track}>
        {isTraditional 
          ? getTraditionalSteps().map((step, index) => renderStep(step, index))
          : steps.map((step, index) => renderStep(step, index))
        }
      </div>
    </nav>
  );
};

export default Breadcrumbs;