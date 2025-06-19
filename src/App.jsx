import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Moroccan Baccalaureate Average Calculator
 * A React application for calculating baccalaureate scores according to Morocco's official grading system
 * 
 * Copyright (c) 2024 Mohamed Driou
 * @license MIT
 */

const APP_VERSION = {
  version: "1.6.2",
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
    coefficient: 4,
    description: "French language exam"
  },
  hg: {
    coefficient: branch1 === "science" ? 2 : 4,
    description: "History & Geography exam"
  },
  islamic: {
    coefficient: 2,
    description: "Islamic education exam"
  },
  ar: {
    coefficient: branch1 === "science" ? 2 : (branch2 === "lettres" ? 4 : 3),
    description: "Arabic language exam"
  },
  math: {
    coefficient: branch1 === "science" ? 7 : 1,
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
    coefficient: 2,
    description: "Philosophy exam"
  },
  en: {
    coefficient: branch1 === "science" ? 2 : (branch2 === "lettres" ? 4 : 3),
    description: "English language exam"
  },
  sport: {
    coefficient: 1,
    description: "Physical Education exam"
  },
  s1: {
    coefficient: "Varies",
    description: "First semester continuous control"
  },
  s2: {
    coefficient: "Varies",
    description: "Second semester continuous control"
  }
});

export default function App() {
  const [studentType, setStudentType] = useState(null);
  const [branch1, setBranch1] = useState("");
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState({});
  const [finalAverage, setFinalAverage] = useState(null);
  const [admitted, setAdmitted] = useState(null);
  const [branch2, setBranch2] = useState("");
  const [hasSport, setHasSport] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [calculationSteps, setCalculationSteps] = useState([]);
  const [continuousControlNote, setContinuousControlNote] = useState(null);
  const [regionalExamNote, setRegionalExamNote] = useState(null);
  const [nationalExamNote, setNationalExamNote] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved preference or system preference
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
    if (step === 2 && studentType === "independent" && hasSport === null) {
      alert("Please answer the Physical Education question");
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

  const handleReset = () => {
    setStudentType(null);
    setBranch1("");
    setBranch2("");
    setStep(0);
    setInputs({});
    setFinalAverage(null);
    setAdmitted(null);
    setHasSport(null);
    setShowResults(false);
    setShowBreakdown(false);
    setCalculationSteps([]);
    setContinuousControlNote(null);
    setRegionalExamNote(null);
    setNationalExamNote(null);
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
    }
    
    if (hasSport) requiredFields.push("sport");
    if (studentType === "regular" && step === (studentType === "regular" ? 5 : 4)) {
      requiredFields.push("s1", "s2");
    }
    
    return requiredFields.every(field => {
      const value = inputs[field];
      return value !== undefined && value !== "" && !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 20;
    });
  };

  const calcAverage = () => {
    console.log("Starting calculation...");
    
    if (!validateInputs()) {
      console.log("Validation failed - missing or invalid fields");
      alert("Please fill all required fields with valid grades (0-20)");
      return;
    }

    try {
      const parsedInputs = Object.fromEntries(
        Object.entries(inputs).map(([key, value]) => [key, parseFloat(value)])
      );

      console.log("Parsed inputs:", parsedInputs);

      const steps = [];
      let finalAverage;

      if (studentType === "regular") {
        // 1. Continuous Controls (25%)
        const continuousAvg = (parsedInputs.s1 + parsedInputs.s2) / 2;
        const continuousControls = continuousAvg * 0.25;
        setContinuousControlNote(continuousAvg.toFixed(2));
        
        steps.push({
          title: "Continuous Controls (25%)",
          value: continuousControls.toFixed(2),
          details: `(Semester 1: ${parsedInputs.s1} + Semester 2: ${parsedInputs.s2}) / 2 = ${continuousAvg.toFixed(2)} × 25%`
        });

        // 2. Regional Exam (25%)
        let regionalExam = 0;
        let regionalAvg = 0;
        if (branch1 === "science") {
          const regionalTotal = parsedInputs.fr * 4 + parsedInputs.hg * 2 + parsedInputs.islamic * 2 + parsedInputs.ar * 2;
          const regionalCoefSum = 4 + 2 + 2 + 2;
          regionalAvg = regionalTotal / regionalCoefSum;
          regionalExam = regionalAvg * 0.25;
          steps.push({
            title: "Regional Exam (25%)",
            value: regionalExam.toFixed(2),
            details: `(FR:${parsedInputs.fr}×4 + HG:${parsedInputs.hg}×2 + ISL:${parsedInputs.islamic}×2 + AR:${parsedInputs.ar}×2) / ${regionalCoefSum} = ${regionalAvg.toFixed(2)} × 25%`
          });
        } else {
          const regionalTotal = parsedInputs.fr * 4 + parsedInputs.islamic * 2 + parsedInputs.math * 1;
          const regionalCoefSum = 4 + 2 + 1;
          regionalAvg = regionalTotal / regionalCoefSum;
          regionalExam = regionalAvg * 0.25;
          steps.push({
            title: "Regional Exam (25%)",
            value: regionalExam.toFixed(2),
            details: `(FR:${parsedInputs.fr}×4 + ISL:${parsedInputs.islamic}×2 + MATH:${parsedInputs.math}×1) / ${regionalCoefSum} = ${regionalAvg.toFixed(2)} × 25%`
          });
        }
        setRegionalExamNote(regionalAvg.toFixed(2));

        // 3. National Exam (50%)
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
        } else {
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
        }
        setNationalExamNote(nationalAvg.toFixed(2));

        // Final average calculation
        finalAverage = continuousControls + regionalExam + nationalExam;
        
        // Add final calculation step
        steps.push({
          title: "Final Average Calculation",
          value: finalAverage.toFixed(2),
          details: `Continuous Controls (${continuousControls.toFixed(2)}) + Regional Exam (${regionalExam.toFixed(2)}) + National Exam (${nationalExam.toFixed(2)})`
        });

        // Set calculation steps for modal
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
        } else {
          regionalTotal = parsedInputs.fr * 4 + parsedInputs.islamic * 2 + parsedInputs.math * 1;
          regionalCoefSum = 4 + 2 + 1;
          if (hasSport) {
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
        } else {
          const coef = branch2 === "lettres" 
            ? { ar: 4, en: 4, hg: 3, philo: 3 }
            : { ar: 3, en: 3, hg: 4, philo: 4 };
          nationalTotal = parsedInputs.ar * coef.ar + parsedInputs.en * coef.en + 
                         parsedInputs.hg * coef.hg + parsedInputs.philo * coef.philo;
          nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
        }
        
        const nationalAvg = nationalTotal / nationalCoefSum;
        setNationalExamNote(nationalAvg.toFixed(2));

        // Final Average (weighted)
        const finalAvg = (regionalAvg * 8 + nationalAvg * 14) / 22;
        finalAverage = finalAvg;

        // Store calculation steps for modal
        setCalculationSteps([
          {
            title: "Regional Exam (8/22)",
            value: regionalAvg.toFixed(2),
            details: branch1 === "science"
              ? `(FR:${parsedInputs.fr}×4 + HG:${parsedInputs.hg}×2 + ISL:${parsedInputs.islamic}×2 + AR:${parsedInputs.ar}×2${hasSport ? ` + SPORT:${parsedInputs.sport}×1` : ''}) / ${regionalCoefSum}`
              : `(FR:${parsedInputs.fr}×4 + ISL:${parsedInputs.islamic}×2 + MATH:${parsedInputs.math}×1${hasSport ? ` + SPORT:${parsedInputs.sport}×1` : ''}) / ${regionalCoefSum}`
          },
          {
            title: "National Exam (14/22)",
            value: nationalAvg.toFixed(2),
            details: branch1 === "science"
              ? `(SVT:${parsedInputs.svt}×${branch2 === "svt" ? 7 : 5} + MATH:${parsedInputs.math}×7 + PC:${parsedInputs.pc}×${branch2 === "pc" ? 7 : 5} + PHILO:${parsedInputs.philo}×2 + EN:${parsedInputs.en}×2) / ${nationalCoefSum}`
              : `(AR:${parsedInputs.ar}×${branch2 === "lettres" ? 4 : 3} + EN:${parsedInputs.en}×${branch2 === "lettres" ? 4 : 3} + HG:${parsedInputs.hg}×${branch2 === "lettres" ? 3 : 4} + PHILO:${parsedInputs.philo}×${branch2 === "lettres" ? 3 : 4}) / ${nationalCoefSum}`
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
      console.log("Calculation completed successfully");
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
      <div className="container">
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
          
          <button 
            className="btn breakdown-btn"
            onClick={() => setShowBreakdown(true)}
          >
            Show Detailed Calculation
          </button>
          
          <button 
            className="reset-btn"
            onClick={handleReset}
          >
            Start New Calculation
          </button>
        </div>
        
        {showBreakdown && <CalculationBreakdownModal />}
        
        <footer className="copyright">
          <p>© 2024 Developed by Mohamed Driou | Moroccan Bac Calculator | MIT Licensed</p>
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

      <div className="progress-bar">
        {[...Array(studentType === 'regular' ? 6 : 5)].map((_, i) => (
          <div 
            key={i} 
            className={`step-dot ${i <= step ? 'active' : ''}`}
            onClick={() => i <= step && setStep(i)}
          />
        ))}
      </div>
      
      <h1>Baccalaureate Average Calculator</h1>

      {step === 0 && (
        <div className="step-content">
          <p>Select your student type:</p>
          <div className="button-group">
            <button className="btn" onClick={() => { setStudentType("regular"); handleNext(); }}>
              Regular Student
            </button>
            <button className="btn" onClick={() => { setStudentType("independent"); handleNext(); }}>
              Independent Candidate
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="step-content">
          <p>Choose your branch:</p>
          <div className="button-group">
            <button className="btn" onClick={() => { setBranch1("science"); handleNext(); }}>
              Science
            </button>
            <button className="btn" onClick={() => { setBranch1("adab"); handleNext(); }}>
              Adab
            </button>
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-content">
          <h2 className="exam-title">Regional Exam</h2>
          {branch1 === "science" ? (
            <>
              {renderInput("fr", "French")}
              {renderInput("hg", "History & Geography")}
              {renderInput("islamic", "Islamic")}
              {renderInput("ar", "Arabic")}
            </>
          ) : (
            <>
              {renderInput("fr", "French")}
              {renderInput("islamic", "Islamic")}
              {renderInput("math", "Math")}
            </>
          )}

          {studentType === "independent" && hasSport === null && (
            <div className="question-box sport-question">
              <p>Do you have Physical Education?</p>
              <div className="sport-buttons">
                <button className="btn btn-yes" onClick={() => setHasSport(true)}>Yes</button>
                <button className="btn btn-no" onClick={() => setHasSport(false)}>No</button>
              </div>
            </div>
          )}

          {studentType === "independent" && hasSport !== null && (
            <>
              {hasSport && renderInput("sport", "Physical Education")}
              <button 
                className="btn btn-change-answer" 
                onClick={() => setHasSport(null)}
              >
                Change Physical Education Answer
              </button>
            </>
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

      {step === 3 && (
        <div className="step-content">
          {branch1 === "science" ? (
            <>
              <p>Choose your scientific stream:</p>
              <div className="button-group">
                <button className="btn" onClick={() => { setBranch2("svt"); handleNext(); }}>
                  SVT
                </button>
                <button className="btn" onClick={() => { setBranch2("pc"); handleNext(); }}>
                  PC
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Choose your literature stream:</p>
              <div className="button-group">
                <button className="btn" onClick={() => { setBranch2("lettres"); handleNext(); }}>
                  Lettres
                </button>
                <button className="btn" onClick={() => { setBranch2("science humain"); handleNext(); }}>
                  Science Humain
                </button>
              </div>
            </>
          )}
          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="step-content">
          <h2 className="exam-title">National Exam</h2>
          {branch1 === "science" ? (
            <>
              {renderInput("svt", "SVT")}
              {renderInput("math", "Math")}
              {renderInput("pc", "Physics-Chemistry")}
              {renderInput("philo", "Philosophy")}
              {renderInput("en", "English")}
            </>
          ) : (
            <>
              {renderInput("ar", "Arabic")}
              {renderInput("en", "English")}
              {renderInput("hg", "History & Geography")}
              {renderInput("philo", "Philosophy")}
            </>
          )}

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
    
      <footer className="copyright">
        <p>© 2024 Developed by Mohamed Driou | Moroccan Bac Calculator | MIT Licensed</p>
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