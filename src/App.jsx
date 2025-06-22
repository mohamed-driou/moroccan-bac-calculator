import React, { useState, useEffect } from "react";
import "./App.css";
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import MainMenu from './components/MainMenu/MainMenu';
import BacFormulaCalculator from './components/BacFormulaCalculator/BacCalculator';

/**
 * Moroccan Baccalaureate Calculator
 * A React application for calculating baccalaureate scores according to Morocco's official grading system
 * 
 * Copyright (c) 2024 Mohamed Driou
 * @license MIT
 */

const APP_VERSION = {
  version: "1.8.0",
  build: Date.now(),
  lastUpdated: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  })
};

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SubjectTooltip = ({ subject, coefficient, description }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="tooltip-container" 
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      <span className="tooltip-icon">i</span>
      <div className={`tooltip-content ${isVisible ? 'visible' : ''}`}>
        <h4>{subject}</h4>
        <p><strong>Coefficient:</strong> {coefficient}</p>
        {description && <p className="tooltip-description">{description}</p>}
      </div>
    </div>
  );
};

const getSubjectInfo = (branch1, branch2) => ({
  fr: {
    coefficient: branch1 === "economics" ? 3 : (branch1 === "science" ? 4 : (branch2 === "lettres" ? 4 : 3)),
    description: "French language exam"
  },
  hg: {
    coefficient: branch1 === "science" ? 2 : (branch1 === "economics" ? 2 : (branch2 === "lettres" ? 3 : 4)),
    description: "History & Geography exam"
  },
  islamic: {
    coefficient: 2,
    description: "Islamic education exam"
  },
  ar: {
    coefficient: branch1 === "science" ? 2 : (branch1 === "economics" ? 2 : (branch2 === "lettres" ? 4 : 3)),
    description: "Arabic language exam"
  },
  math: {
    coefficient: branch1 === "science" ? 7 : (branch1 === "economics" ? 4 : 1),
    description: "Mathematics exam"
  },
  svt: {
    coefficient: branch2 === "svt" ? 7 : 5,
    description: "Life and Earth Sciences exam"
  },
  pc: {
    coefficient: branch2 === "pc" ? 7 : 5,
    description: "Physics-Chemistry exam"
  },
  philo: {
    coefficient: branch1 === "science" ? 2 : (branch1 === "economics" ? 2 : (branch2 === "lettres" ? 3 : 4)),
    description: "Philosophy exam"
  },
  en: {
    coefficient: branch1 === "science" ? 2 : (branch1 === "economics" ? 2 : (branch2 === "lettres" ? 4 : 3)),
    description: "English language exam"
  },
  sport: {
    coefficient: 1,
    description: "Physical Education exam"
  },
  translation: {
    coefficient: 2,
    description: "Translation exam (Arabic to French/English)"
  },
  s1: {
    coefficient: "Varies",
    description: "First semester continuous control"
  },
  s2: {
    coefficient: "Varies",
    description: "Second semester continuous control"
  },
  mis: {
    coefficient: 1,
    description: "Management Information Systems exam"
  },
  accounting: {
    coefficient: 6,
    description: "Accounting and Financial Mathematics exam"
  },
  economics: {
    coefficient: 6,
    description: "Economics and Business Organization exam"
  },
  general_economics: {
    coefficient: 3,
    description: "General Economics and Statistics exam"
  },
  law: {
    coefficient: 1,
    description: "Law exam"
  }
});

function BacAverageByStream({ onBack }) {
  const [studentType, setStudentType] = useState(null);
  const [branch1, setBranch1] = useState("");
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState({});
  const [finalAverage, setFinalAverage] = useState(null);
  const [admitted, setAdmitted] = useState(null);
  const [branch2, setBranch2] = useState("");
  const [hasSport, setHasSport] = useState(null);
  const [hasMIS, setHasMIS] = useState(null);
  const [hasLaw, setHasLaw] = useState(null);
  const [hasTranslation, setHasTranslation] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [calculationSteps, setCalculationSteps] = useState([]);
  const [continuousControlNote, setContinuousControlNote] = useState(null);
  const [regionalExamNote, setRegionalExamNote] = useState(null);
  const [nationalExamNote, setNationalExamNote] = useState(null);
  const [selectedValues, setSelectedValues] = useState({});
  
  const breadcrumbSteps = [
    { label: 'Student Type', valueKey: 'studentType' },
    { label: 'Branch', valueKey: 'branch1' },
    { label: 'Regional Exam', valueKey: null },
    ...(branch1 === 'science' || branch1 === 'economics' ? 
      [{ label: 'Stream', valueKey: 'branch2' }] : []),
    { label: 'National Exam', valueKey: null },
    ...(studentType === 'regular' ? [{ label: 'Controls', valueKey: null }] : [])
  ];

  const subjectInfo = getSubjectInfo(branch1, branch2);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validPattern = /^(\d{0,2}(\.\d{0,2})?)$/;
    if (validPattern.test(value)) {
      if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 20)) {
        setInputs(prev => ({ ...prev, [name]: value }));
        setFinalAverage(null);
        setAdmitted(null);
      }
    }
  };

  const handleNext = () => {
    if (step === 2 && branch1 === "economics") {
      if (hasMIS === null) {
        alert("Please answer the Management Information Systems question");
        return;
      }
      if (hasLaw === null) {
        alert("Please answer the Law question");
        return;
      }
      if (studentType === "independent" && hasSport === null) {
        alert("Please answer the Physical Education question");
        return;
      }
    }
    if (step === 2 && hasTranslation === null && branch1 !== "economics") {
      alert("Please answer the Translation question");
      return;
    }
    setStep(prev => prev + 1);
    setFinalAverage(null);
    setAdmitted(null);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setFinalAverage(null);
    setAdmitted(null);
  };

  const handleBackFromResults = () => {
    setShowResults(false);
    const targetStep = studentType === "regular" ? 5 : 4;
    setStep(targetStep);
  };

  const handleReset = () => {
    setStudentType(null);
    setBranch1("");
    setBranch2("");
    setStep(0);
    setInputs({});
    setFinalAverage(null);
    setAdmitted(null);
    setHasSport(null);
    setHasMIS(null);
    setHasLaw(null);
    setHasTranslation(null);
    setShowResults(false);
    setShowBreakdown(false);
    setCalculationSteps([]);
    setContinuousControlNote(null);
    setRegionalExamNote(null);
    setNationalExamNote(null);
    setSelectedValues({});
  };

  const validateInputs = () => {
    const requiredFields = [];
    
    if (branch1 === "science") {
      requiredFields.push("fr", "hg", "islamic", "ar", "math");
      if (branch2 === "svt") requiredFields.push("svt");
      if (branch2 === "pc") requiredFields.push("pc");
      requiredFields.push("philo", "en");
    } else if (branch1 === "adab") {
      requiredFields.push("fr", "islamic", "math", "ar", "en", "hg", "philo");
    } else if (branch1 === "economics") {
      requiredFields.push("ar", "fr", "islamic", "hg");
      if (hasMIS === true) requiredFields.push("mis");
      if (hasLaw === true) requiredFields.push("law");
      if (studentType === "independent" && hasSport === true) {
        requiredFields.push("sport");
      }
      requiredFields.push("math", "accounting", "general_economics", "economics", "philo", "en");
    }

    if (branch1 !== "economics" && hasTranslation) {
      requiredFields.push("translation");
    }

    if (studentType === "regular" && step === 5) {
      requiredFields.push("s1", "s2");
    }
    
    return requiredFields.every(field => {
      const value = inputs[field];
      return value !== undefined && value !== "" && !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 20;
    });
  };

  const calcAverage = () => {
    if (!validateInputs()) {
      alert("Please fill all required fields with valid grades (0-20)");
      return;
    }

    try {
      const parsedInputs = Object.fromEntries(
        Object.entries(inputs).map(([key, value]) => [key, parseFloat(value)])
      );

      const steps = [];
      let finalAverage;

      if (studentType === "regular") {
        // Continuous Controls (25%)
        const continuousAvg = (parsedInputs.s1 + parsedInputs.s2) / 2;
        const continuousControls = continuousAvg * 0.25;
        setContinuousControlNote(continuousAvg.toFixed(2));
        
        steps.push({
          title: "Continuous Controls (25%)",
          value: continuousControls.toFixed(2),
          details: `(Semester 1: ${parsedInputs.s1} + Semester 2: ${parsedInputs.s2}) / 2 = ${continuousAvg.toFixed(2)} × 25%`
        });

        // Regional Exam (25%)
        let regionalExam = 0;
        let regionalAvg = 0;
        if (branch1 === "science") {
          let regionalTotal = parsedInputs.fr * 4 + parsedInputs.hg * 2 + parsedInputs.islamic * 2 + parsedInputs.ar * 2;
          let regionalCoefSum = 4 + 2 + 2 + 2;
          if (hasTranslation) {
            regionalTotal += parsedInputs.translation * 2;
            regionalCoefSum += 2;
          }
          regionalAvg = regionalTotal / regionalCoefSum;
          regionalExam = regionalAvg * 0.25;
          steps.push({
            title: "Regional Exam (25%)",
            value: regionalExam.toFixed(2),
            details: `(FR:${parsedInputs.fr}×4 + HG:${parsedInputs.hg}×2 + ISL:${parsedInputs.islamic}×2 + AR:${parsedInputs.ar}×2${hasTranslation ? ` + TRANS:${parsedInputs.translation}×2` : ''}) / ${regionalCoefSum} = ${regionalAvg.toFixed(2)} × 25%`
          });
        } else if (branch1 === "adab") {
          let regionalTotal = parsedInputs.fr * 4 + parsedInputs.islamic * 2 + parsedInputs.math * 1;
          let regionalCoefSum = 4 + 2 + 1;
          if (hasTranslation) {
            regionalTotal += parsedInputs.translation * 2;
            regionalCoefSum += 2;
          }
          regionalAvg = regionalTotal / regionalCoefSum;
          regionalExam = regionalAvg * 0.25;
          steps.push({
            title: "Regional Exam (25%)",
            value: regionalExam.toFixed(2),
            details: `(FR:${parsedInputs.fr}×4 + ISL:${parsedInputs.islamic}×2 + MATH:${parsedInputs.math}×1${hasTranslation ? ` + TRANS:${parsedInputs.translation}×2` : ''}) / ${regionalCoefSum} = ${regionalAvg.toFixed(2)} × 25%`
          });
        } else if (branch1 === "economics") {
          let regionalTotal = parsedInputs.ar * 2 + parsedInputs.fr * 3 + 
                            parsedInputs.islamic * 2 + parsedInputs.hg * 2;
          let regionalCoefSum = 2 + 3 + 2 + 2;
          
          if (hasMIS === true) {
            regionalTotal += parsedInputs.mis * 1;
            regionalCoefSum += 1;
          }
          
          if (hasLaw === true) {
            regionalTotal += parsedInputs.law * 1;
            regionalCoefSum += 1;
          }

          regionalAvg = regionalTotal / regionalCoefSum;
          regionalExam = regionalAvg * 0.25;
          
          let details = `(AR:${parsedInputs.ar}×2 + FR:${parsedInputs.fr}×3 + ISL:${parsedInputs.islamic}×2 + HG:${parsedInputs.hg}×2`;
          if (hasMIS === true) details += ` + MIS:${parsedInputs.mis}×1`;
          if (hasLaw === true) details += ` + LAW:${parsedInputs.law}×1`;
          details += `) / ${regionalCoefSum} = ${regionalAvg.toFixed(2)} × 25%`;
          
          steps.push({
            title: "Regional Exam (25%)",
            value: regionalExam.toFixed(2),
            details: details
          });
        }
        setRegionalExamNote(regionalAvg.toFixed(2));

        // National Exam (50%)
        let nationalExam = 0;
        let nationalAvg = 0;
        if (branch1 === "science") {
          const coef = {
            svt: branch2 === "svt" ? 7 : 5,
            math: 7,
            pc: branch2 === "pc" ? 7 : 5,
            philo: 2,
            en: 2,
          };
          const nationalTotal = parsedInputs.svt * coef.svt + parsedInputs.math * coef.math + parsedInputs.pc * coef.pc + parsedInputs.philo * coef.philo + parsedInputs.en * coef.en;
          const nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
          nationalAvg = nationalTotal / nationalCoefSum;
          nationalExam = nationalAvg * 0.50;
          steps.push({
            title: "National Exam (50%)",
            value: nationalExam.toFixed(2),
            details: `(SVT:${parsedInputs.svt}×${coef.svt} + MATH:${parsedInputs.math}×${coef.math} + PC:${parsedInputs.pc}×${coef.pc} + PHILO:${parsedInputs.philo}×${coef.philo} + EN:${parsedInputs.en}×${coef.en}) / ${nationalCoefSum} = ${nationalAvg.toFixed(2)} × 50%`
          });
        } else if (branch1 === "adab") {
          const coef = branch2 === "lettres" 
            ? { ar: 4, en: 4, hg: 3, philo: 3 }
            : { ar: 3, en: 3, hg: 4, philo: 4 };
          const nationalTotal = parsedInputs.ar * coef.ar + parsedInputs.en * coef.en + parsedInputs.hg * coef.hg + parsedInputs.philo * coef.philo;
          const nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
          nationalAvg = nationalTotal / nationalCoefSum;
          nationalExam = nationalAvg * 0.50;
          steps.push({
            title: "National Exam (50%)",
            value: nationalExam.toFixed(2),
            details: `(AR:${parsedInputs.ar}×${coef.ar} + EN:${parsedInputs.en}×${coef.en} + HG:${parsedInputs.hg}×${coef.hg} + PHILO:${parsedInputs.philo}×${coef.philo}) / ${nationalCoefSum} = ${nationalAvg.toFixed(2)} × 50%`
          });
        } else if (branch1 === "economics") {
          const coef = {
            math: 4,
            accounting: 6,
            general_economics: 3,
            economics: 6,
            philo: 2,
            en: 2
          };
          const nationalTotal = parsedInputs.math * coef.math + 
                              parsedInputs.accounting * coef.accounting + 
                              parsedInputs.general_economics * coef.general_economics + 
                              parsedInputs.economics * coef.economics + 
                              parsedInputs.philo * coef.philo + 
                              parsedInputs.en * coef.en;
          const nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
          nationalAvg = nationalTotal / nationalCoefSum;
          nationalExam = nationalAvg * 0.50;
          steps.push({
            title: "National Exam (50%)",
            value: nationalExam.toFixed(2),
            details: `(MATH:${parsedInputs.math}×4 + ACCOUNT:${parsedInputs.accounting}×6 + GEN_ECON:${parsedInputs.general_economics}×3 + ECON:${parsedInputs.economics}×6 + PHILO:${parsedInputs.philo}×2 + EN:${parsedInputs.en}×2) / ${nationalCoefSum} = ${nationalAvg.toFixed(2)} × 50%`
          });
        }
        setNationalExamNote(nationalAvg.toFixed(2));

        // Final average calculation
        finalAverage = continuousControls + regionalExam + nationalExam;
        
        steps.push({
          title: "Final Average Calculation",
          value: finalAverage.toFixed(2),
          details: `Continuous Controls (${continuousControls.toFixed(2)}) + Regional Exam (${regionalExam.toFixed(2)}) + National Exam (${nationalExam.toFixed(2)})`
        });

        setCalculationSteps(steps);
      } else {
        // Independent candidate calculation
        setContinuousControlNote(null);

        // Regional Exam (8/22 weight)
        let regionalTotal = 0;
        let regionalCoefSum = 0;
        
        if (branch1 === "science") {
          regionalTotal = parsedInputs.fr * 4 + parsedInputs.hg * 2 + parsedInputs.islamic * 2 + parsedInputs.ar * 2;
          regionalCoefSum = 4 + 2 + 2 + 2;
          if (hasSport) {
            regionalTotal += parsedInputs.sport * 1;
            regionalCoefSum += 1;
          }
          if (hasTranslation) {
            regionalTotal += parsedInputs.translation * 2;
            regionalCoefSum += 2;
          }
        } else if (branch1 === "adab") {
          regionalTotal = parsedInputs.fr * 4 + parsedInputs.islamic * 2 + parsedInputs.math * 1;
          regionalCoefSum = 4 + 2 + 1;
          if (hasSport) {
            regionalTotal += parsedInputs.sport * 1;
            regionalCoefSum += 1;
          }
          if (hasTranslation) {
            regionalTotal += parsedInputs.translation * 2;
            regionalCoefSum += 2;
          }
        } else if (branch1 === "economics") {
          regionalTotal = parsedInputs.ar * 2 + parsedInputs.fr * 3 + 
                         parsedInputs.islamic * 2 + parsedInputs.hg * 2;
          regionalCoefSum = 2 + 3 + 2 + 2;
          
          if (hasMIS === true) {
            regionalTotal += parsedInputs.mis * 1;
            regionalCoefSum += 1;
          }
          
          if (hasLaw === true) {
            regionalTotal += parsedInputs.law * 1;
            regionalCoefSum += 1;
          }

          if (hasSport === true) {
            regionalTotal += parsedInputs.sport * 1;
            regionalCoefSum += 1;
          }
        }
        
        const regionalAvg = regionalTotal / regionalCoefSum;
        setRegionalExamNote(regionalAvg.toFixed(2));

        // National Exam (14/22 weight)
        let nationalTotal = 0;
        let nationalCoefSum = 0;
        
        if (branch1 === "science") {
          const coef = {
            svt: branch2 === "svt" ? 7 : 5,
            math: 7,
            pc: branch2 === "pc" ? 7 : 5,
            philo: 2,
            en: 2,
          };
          nationalTotal = parsedInputs.svt * coef.svt + parsedInputs.math * coef.math + 
                         parsedInputs.pc * coef.pc + parsedInputs.philo * coef.philo + 
                         parsedInputs.en * coef.en;
          nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
        } else if (branch1 === "adab") {
          const coef = branch2 === "lettres" 
            ? { ar: 4, en: 4, hg: 3, philo: 3 }
            : { ar: 3, en: 3, hg: 4, philo: 4 };
          nationalTotal = parsedInputs.ar * coef.ar + parsedInputs.en * coef.en + 
                         parsedInputs.hg * coef.hg + parsedInputs.philo * coef.philo;
          nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
        } else if (branch1 === "economics") {
          const coef = {
            math: 4,
            accounting: 6,
            general_economics: 3,
            economics: 6,
            philo: 2,
            en: 2
          };
          nationalTotal = parsedInputs.math * coef.math + 
                         parsedInputs.accounting * coef.accounting + 
                         parsedInputs.general_economics * coef.general_economics + 
                         parsedInputs.economics * coef.economics + 
                         parsedInputs.philo * coef.philo + 
                         parsedInputs.en * coef.en;
          nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
        }
        
        const nationalAvg = nationalTotal / nationalCoefSum;
        setNationalExamNote(nationalAvg.toFixed(2));

        // Final Average (weighted)
        const finalAvg = (regionalAvg * 8 + nationalAvg * 14) / 22;
        finalAverage = finalAvg;

        setCalculationSteps([
          {
            title: "Regional Exam (8/22)",
            value: regionalAvg.toFixed(2),
            details: branch1 === "science"
              ? `(FR:${parsedInputs.fr}×4 + HG:${parsedInputs.hg}×2 + ISL:${parsedInputs.islamic}×2 + AR:${parsedInputs.ar}×2${hasSport ? ` + SPORT:${parsedInputs.sport}×1` : ''}${hasTranslation ? ` + TRANS:${parsedInputs.translation}×2` : ''}) / ${regionalCoefSum}`
              : branch1 === "adab"
                ? `(FR:${parsedInputs.fr}×4 + ISL:${parsedInputs.islamic}×2 + MATH:${parsedInputs.math}×1${hasSport ? ` + SPORT:${parsedInputs.sport}×1` : ''}${hasTranslation ? ` + TRANS:${parsedInputs.translation}×2` : ''}) / ${regionalCoefSum}`
                : `(AR:${parsedInputs.ar}×2 + FR:${parsedInputs.fr}×3 + ISL:${parsedInputs.islamic}×2 + HG:${parsedInputs.hg}×2${hasMIS ? ` + MIS:${parsedInputs.mis}×1` : ''}${hasLaw ? ` + LAW:${parsedInputs.law}×1` : ''}${hasSport ? ` + SPORT:${parsedInputs.sport}×1` : ''}) / ${regionalCoefSum}`
          },
          {
            title: "National Exam (14/22)",
            value: nationalAvg.toFixed(2),
            details: branch1 === "science"
              ? `(SVT:${parsedInputs.svt}×${branch2 === "svt" ? 7 : 5} + MATH:${parsedInputs.math}×7 + PC:${parsedInputs.pc}×${branch2 === "pc" ? 7 : 5} + PHILO:${parsedInputs.philo}×2 + EN:${parsedInputs.en}×2) / ${nationalCoefSum}`
              : branch1 === "adab"
                ? `(AR:${parsedInputs.ar}×${branch2 === "lettres" ? 4 : 3} + EN:${parsedInputs.en}×${branch2 === "lettres" ? 4 : 3} + HG:${parsedInputs.hg}×${branch2 === "lettres" ? 3 : 4} + PHILO:${parsedInputs.philo}×${branch2 === "lettres" ? 3 : 4}) / ${nationalCoefSum}`
                : `(MATH:${parsedInputs.math}×4 + ACCOUNT:${parsedInputs.accounting}×6 + GEN_ECON:${parsedInputs.general_economics}×3 + ECON:${parsedInputs.economics}×6 + PHILO:${parsedInputs.philo}×2 + EN:${parsedInputs.en}×2) / ${nationalCoefSum}`
          },
          {
            title: "Weighted Final Average",
            value: finalAvg.toFixed(2),
            details: `(${regionalAvg.toFixed(2)} × 8 + ${nationalAvg.toFixed(2)} × 14) / 22`
          }
        ]);
      }

      setFinalAverage(finalAverage.toFixed(2));
      setAdmitted(finalAverage >= 10);
      setShowResults(true);
    } catch (error) {
      console.error("Calculation error:", error);
      alert("An error occurred during calculation. Please check your inputs.");
    }
  };

  const renderInput = (name, label) => {
    const value = inputs[name] || "";
    const subjectData = subjectInfo[name] || { coefficient: 1 };
    
    return (
      <div className="input-group">
        <div className="input-label-wrapper">
          <label htmlFor={name}>{label}</label>
          <SubjectTooltip 
            subject={label} 
            coefficient={subjectData.coefficient} 
            description={subjectData.description} 
          />
        </div>
        <input
          id={name}
          name={name}
          placeholder={`Enter ${label} grade`}
          value={value}
          onChange={handleChange}
          type="text"
          inputMode="decimal"
        />
      </div>
    );
  };

  const CalculationBreakdownModal = () => (
    <div className="modal-overlay" onClick={() => setShowBreakdown(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Calculation Breakdown</h3>
        <div className="calculation-steps">
          {calculationSteps.map((step, index) => (
            <div key={index} className="calculation-step">
              <div className="step-header">
                <span className="step-title">{step.title}</span>
                <span className="step-value">{step.value}</span>
              </div>
              <div className="step-details">{step.details}</div>
            </div>
          ))}
        </div>
        <button 
          className="btn close-btn"
          onClick={() => setShowBreakdown(false)}
        >
          Close
        </button>
      </div>
    </div>
  );

  if (showResults) {
    return (
      <div className="stream-view">
        <div className="results-screen">
          <h2>YOUR RESULT</h2>
          <div className="final-score">
            {finalAverage} <span className="score-max">/20</span>
          </div>

          <div className="exam-components">
            {studentType === "regular" && (
              <div className="exam-component">
                <span className="component-label">Continuous Control:</span>
                <span className="component-value">{continuousControlNote}/20</span>
              </div>
            )}
            <div className="exam-component">
              <span className="component-label">Regional Exam:</span>
              <span className="component-value">{regionalExamNote}/20</span>
            </div>
            <div className="exam-component">
              <span className="component-label">National Exam:</span>
              <span className="component-value">{nationalExamNote}/20</span>
            </div>
          </div>

          <p className={`result-message ${admitted ? "success" : "error"}`}>
            {admitted ? "Congratulations! You are admitted" : "Unfortunately, you are not admitted"}
          </p>
          
          <div className="results-actions">
            <button 
              className="btn breakdown-btn"
              onClick={() => setShowBreakdown(true)}
            >
              Show Detailed Calculation
            </button>
            
            <button 
              className="btn back-btn"
              onClick={handleBackFromResults}
            >
              Back to Calculation
            </button>
            
            <button 
              className="reset-btn"
              onClick={handleReset}
            >
              Start New Calculation
            </button>
          </div>
        </div>
        
        {showBreakdown && <CalculationBreakdownModal />}
      </div>
    );
  }

  return (
    <div className="stream-view">
      <button onClick={onBack} className="back-button">
        ← Back to Menu
      </button>
      
      <Breadcrumbs 
        steps={breadcrumbSteps} 
        currentStep={step} 
        selectedValues={{
          studentType: studentType === "regular" ? "Regular Student" : "Independent Candidate",
          branch1: branch1 === "science" ? "Science" : 
                  branch1 === "adab" ? "Adab" : 
                  branch1 === "economics" ? "Economics & Management" : "",
          branch2: branch2 === "svt" ? "SVT" : 
                  branch2 === "pc" ? "PC" : 
                  branch2 === "lettres" ? "Lettres" : 
                  branch2 === "science humain" ? "Science Humain" :
                  branch2 === "accounting" ? "Accounting Management Sciences" : ""
        }}
      />

      <div className="progress-bar">
        {[...Array(studentType === 'regular' ? 6 : 5)].map((_, i) => (
          <div 
            key={i} 
            className={`step-dot ${i <= step ? 'active' : ''}`}
            onClick={() => i <= step && setStep(i)}
          />
        ))}
      </div>
      
      <h1>Bac Average by Stream</h1>

      {step === 0 && (
        <div className="step-content">
          <p>Select your student type:</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setStudentType("regular"); 
              setSelectedValues(prev => ({ ...prev, studentType: "Regular Student" }));
              handleNext(); 
            }}>
              Regular Student
            </button>
            <button className="btn" onClick={() => { 
              setStudentType("independent"); 
              setSelectedValues(prev => ({ ...prev, studentType: "Independent Candidate" }));
              handleNext(); 
            }}>
              Independent Candidate
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="step-content">
          <p>Choose your branch:</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setBranch1("science"); 
              setSelectedValues(prev => ({ ...prev, branch1: "Science" }));
              handleNext(); 
            }}>
              Science
            </button>
            <button className="btn" onClick={() => { 
              setBranch1("adab"); 
              setSelectedValues(prev => ({ ...prev, branch1: "Adab" }));
              handleNext(); 
            }}>
              Adab
            </button>
            <button className="btn" onClick={() => { 
              setBranch1("economics"); 
              setSelectedValues(prev => ({ ...prev, branch1: "Economics & Management" }));
              handleNext(); 
            }}>
              Economics & Management
            </button>
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      )}

      {step === 2 && branch1 === "science" && (
        <div className="step-content">
          <h2 className="exam-title">Regional Exam</h2>
          {renderInput("fr", "French")}
          {renderInput("hg", "History & Geography")}
          {renderInput("islamic", "Islamic")}
          {renderInput("ar", "Arabic")}

          {/* Translation Question */}
          {hasTranslation === null && (
            <div className="question-box translation-question">
              <p>Do you have Translation?</p>
              <div className="translation-buttons">
                <button className="btn btn-yes" onClick={() => setHasTranslation(true)}>Yes</button>
                <button className="btn btn-no" onClick={() => setHasTranslation(false)}>No</button>
              </div>
            </div>
          )}

          {/* Show Translation input if answered Yes */}
          {hasTranslation === true && renderInput("translation", "Translation")}

          {/* Show change answer button if translation answer exists */}
          {hasTranslation !== null && (
            <button 
              className="btn btn-change-answer" 
              onClick={() => {
                setHasTranslation(null);
                setInputs(prev => {
                  const newInputs = {...prev};
                  delete newInputs.translation;
                  return newInputs;
                });
              }}
            >
              Change Translation Answer
            </button>
          )}

          {/* Physical Education Question (only for independent candidates) */}
          {studentType === "independent" && hasSport === null && (
            <div className="question-box sport-question">
              <p>Do you have Physical Education?</p>
              <div className="sport-buttons">
                <button className="btn btn-yes" onClick={() => setHasSport(true)}>Yes</button>
                <button className="btn btn-no" onClick={() => setHasSport(false)}>No</button>
              </div>
            </div>
          )}

          {/* Show Physical Education input if answered Yes */}
          {studentType === "independent" && hasSport === true && renderInput("sport", "Physical Education")}

          {/* Show change answer button if sport answer exists */}
          {studentType === "independent" && hasSport !== null && (
            <button 
              className="btn btn-change-answer" 
              onClick={() => {
                setHasSport(null);
                setInputs(prev => {
                  const newInputs = {...prev};
                  delete newInputs.sport;
                  return newInputs;
                });
              }}
            >
              Change Physical Education Answer
            </button>
          )}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
            <button className="btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && branch1 === "adab" && (
        <div className="step-content">
          <h2 className="exam-title">Regional Exam</h2>
          {renderInput("fr", "French")}
          {renderInput("islamic", "Islamic")}
          {renderInput("math", "Math")}

          {/* Translation Question */}
          {hasTranslation === null && (
            <div className="question-box translation-question">
              <p>Do you have Translation?</p>
              <div className="translation-buttons">
                <button className="btn btn-yes" onClick={() => setHasTranslation(true)}>Yes</button>
                <button className="btn btn-no" onClick={() => setHasTranslation(false)}>No</button>
              </div>
            </div>
          )}

          {/* Show Translation input if answered Yes */}
          {hasTranslation === true && renderInput("translation", "Translation")}

          {/* Show change answer button if translation answer exists */}
          {hasTranslation !== null && (
            <button 
              className="btn btn-change-answer" 
              onClick={() => {
                setHasTranslation(null);
                setInputs(prev => {
                  const newInputs = {...prev};
                  delete newInputs.translation;
                  return newInputs;
                });
              }}
            >
              Change Translation Answer
            </button>
          )}

          {/* Physical Education Question (only for independent candidates) */}
          {studentType === "independent" && hasSport === null && (
            <div className="question-box sport-question">
              <p>Do you have Physical Education?</p>
              <div className="sport-buttons">
                <button className="btn btn-yes" onClick={() => setHasSport(true)}>Yes</button>
                <button className="btn btn-no" onClick={() => setHasSport(false)}>No</button>
              </div>
            </div>
          )}

          {/* Show Physical Education input if answered Yes */}
          {studentType === "independent" && hasSport === true && renderInput("sport", "Physical Education")}

          {/* Show change answer button if sport answer exists */}
          {studentType === "independent" && hasSport !== null && (
            <button 
              className="btn btn-change-answer" 
              onClick={() => {
                setHasSport(null);
                setInputs(prev => {
                  const newInputs = {...prev};
                  delete newInputs.sport;
                  return newInputs;
                });
              }}
            >
              Change Physical Education Answer
            </button>
          )}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
            <button className="btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && branch1 === "economics" && (
        <div className="step-content">
          <h2 className="exam-title">Regional Exam</h2>
          {renderInput("ar", "Arabic")}
          {renderInput("fr", "French")}
          {renderInput("islamic", "Islamic")}
          {renderInput("hg", "History & Geography")}

          {/* MIS Question */}
          {hasMIS === null && (
            <div className="question-box mis-question">
              <p>Do you have Management Information Systems?</p>
              <div className="mis-buttons">
                <button className="btn btn-yes" onClick={() => setHasMIS(true)}>Yes</button>
                <button className="btn btn-no" onClick={() => setHasMIS(false)}>No</button>
              </div>
            </div>
          )}

          {/* Show MIS input if answered Yes */}
          {hasMIS === true && renderInput("mis", "Management Information Systems")}

          {/* Change MIS answer button */}
          {hasMIS !== null && (
            <button 
              className="btn btn-change-answer" 
              onClick={() => {
                setHasMIS(null);
                setInputs(prev => {
                  const newInputs = {...prev};
                  delete newInputs.mis;
                  return newInputs;
                });
              }}
            >
              Change MIS Answer
            </button>
          )}

          {/* Law Question */}
          {hasLaw === null && (
            <div className="question-box law-question">
              <p>Do you have Law?</p>
              <div className="law-buttons">
                <button className="btn btn-yes" onClick={() => setHasLaw(true)}>Yes</button>
                <button className="btn btn-no" onClick={() => setHasLaw(false)}>No</button>
              </div>
            </div>
          )}

          {/* Show Law input if answered Yes */}
          {hasLaw === true && renderInput("law", "Law")}

          {/* Change Law answer button */}
          {hasLaw !== null && (
            <button 
              className="btn btn-change-answer" 
              onClick={() => {
                setHasLaw(null);
                setInputs(prev => {
                  const newInputs = {...prev};
                  delete newInputs.law;
                  return newInputs;
                });
              }}
            >
              Change Law Answer
            </button>
          )}

          {/* Physical Education Question (only for independent candidates) */}
          {studentType === "independent" && hasSport === null && (
            <div className="question-box sport-question">
              <p>Do you have Physical Education?</p>
              <div className="sport-buttons">
                <button className="btn btn-yes" onClick={() => setHasSport(true)}>Yes</button>
                <button className="btn btn-no" onClick={() => setHasSport(false)}>No</button>
              </div>
            </div>
          )}

          {/* Show Physical Education input if answered Yes */}
          {studentType === "independent" && hasSport === true && renderInput("sport", "Physical Education")}

          {/* Change Physical Education answer button */}
          {studentType === "independent" && hasSport !== null && (
            <button 
              className="btn btn-change-answer" 
              onClick={() => {
                setHasSport(null);
                setInputs(prev => {
                  const newInputs = {...prev};
                  delete newInputs.sport;
                  return newInputs;
                });
              }}
            >
              Change Physical Education Answer
            </button>
          )}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
            <button className="btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && branch1 === "science" && (
        <div className="step-content">
          <p>Choose your scientific stream:</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setBranch2("svt"); 
              setSelectedValues(prev => ({ ...prev, branch2: "SVT" }));
              handleNext(); 
            }}>
              SVT
            </button>
            <button className="btn" onClick={() => { 
              setBranch2("pc"); 
              setSelectedValues(prev => ({ ...prev, branch2: "PC" }));
              handleNext(); 
            }}>
              PC
            </button>
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      )}

      {step === 3 && branch1 === "adab" && (
        <div className="step-content">
          <p>Choose your literature stream:</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setBranch2("lettres"); 
              setSelectedValues(prev => ({ ...prev, branch2: "Lettres" }));
              handleNext(); 
            }}>
              Lettres
            </button>
            <button className="btn" onClick={() => { 
              setBranch2("science humain"); 
              setSelectedValues(prev => ({ ...prev, branch2: "Science Humain" }));
              handleNext(); 
            }}>
              Science Humain
            </button>
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      )}

      {step === 3 && branch1 === "economics" && (
        <div className="step-content">
          <p>Choose your Economics and Management stream:</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setBranch2("accounting"); 
              setSelectedValues(prev => ({ ...prev, branch2: "Accounting Management Sciences" }));
              handleNext(); 
            }}>
              Accounting Management Sciences
            </button>
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      )}

      {step === 4 && branch1 === "science" && (
        <div className="step-content">
          <h2 className="exam-title">National Exam</h2>
          {renderInput("svt", "SVT")}
          {renderInput("math", "Math")}
          {renderInput("pc", "Physics-Chemistry")}
          {renderInput("philo", "Philosophy")}
          {renderInput("en", "English")}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>
                Calculate Average
              </button>
            ) : (
              <button className="btn" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {step === 4 && branch1 === "adab" && (
        <div className="step-content">
          <h2 className="exam-title">National Exam</h2>
          {renderInput("ar", "Arabic")}
          {renderInput("en", "English")}
          {renderInput("hg", "History & Geography")}
          {renderInput("philo", "Philosophy")}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>
                Calculate Average
              </button>
            ) : (
              <button className="btn" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {step === 4 && branch1 === "economics" && (
        <div className="step-content">
          <h2 className="exam-title">National Exam</h2>
          {renderInput("math", "Mathematics")}
          {renderInput("accounting", "Accounting and Financial Mathematics")}
          {renderInput("general_economics", "General Economics and Statistics")}
          {renderInput("economics", "Economics and Business Organization")}
          {renderInput("philo", "Philosophy")}
          {renderInput("en", "English")}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>
                Calculate Average
              </button>
            ) : (
              <button className="btn" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {step === 5 && studentType === "regular" && (
        <div className="step-content">
          <h2 className="exam-title">Continuous Controls</h2>
          {renderInput("s1", "Semester 1")}
          {renderInput("s2", "Semester 2")}
          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
            <button className="btn" onClick={calcAverage}>
              Calculate Average
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('menu');

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode === 'true' || (!savedMode && systemPrefersDark)) {
      setDarkMode(true);
      document.body.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', newMode);
  };

  const renderCurrentView = () => {
    switch(currentView) {
      case 'stream':
        return <BacAverageByStream onBack={() => setCurrentView('menu')} />;
      case 'formula':
        return <BacFormulaCalculator onBack={() => setCurrentView('menu')} />;
      default:
        return <MainMenu onSelectCalculator={(type) => setCurrentView(type)} />;
    }
  };

  return (
    <div className="container">
      <div className="toggle-container">
        <span className="toggle-icon sun-icon">
          <SunIcon />
        </span>
        <label className="theme-toggle">
          <input 
            type="checkbox" 
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <span className="slider"></span>
        </label>
        <span className="toggle-icon moon-icon">
          <MoonIcon />
        </span>
      </div>

      {renderCurrentView()}

      <footer className="copyright">
        <p>© 2024 Developed by Mohamed Driou | MOROCCAN BAC CALCULATOR | MIT Licensed</p>
        <div className="version-info">
          <span>v{APP_VERSION.version}</span>
          <span>•</span>
          <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT License</a>
          <span>•</span>
          <span>Updated: {APP_VERSION.lastUpdated}</span>
        </div>
      </footer>
    </div>
  );
}