import React, { useState } from "react";
import "./App.css";

/**
 * Moroccan Baccalaureate Average Calculator
 * A React application for calculating baccalaureate scores according to Morocco's official grading system
 * 
 * Copyright (c) 2024 Mohamed Driou
 * @license MIT
 */

const APP_VERSION = {
  version: "1.4.7",
  build: Date.now(),
  lastUpdated: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  })
};
console.log("Bac Calculator Version:", APP_VERSION);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validPattern = /^(\d{0,2}(\.\d{0,2})?)?$/;
    if (validPattern.test(value)) {
      if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 20)) {
        setInputs({ ...inputs, [name]: value });
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
    setStep(step + 1);
    setFinalAverage(null);
    setAdmitted(null);
  };

  const handleBack = () => {
    setStep(step - 1);
    setFinalAverage(null);
    setAdmitted(null);
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
    if (studentType === "regular") {
      requiredFields.push("s1", "s2");
    }
    
    return requiredFields.every(field => inputs[field] && !isNaN(inputs[field]));
  };

  const calcAverage = () => {
    if (!validateInputs()) {
      alert("Please fill all required fields with valid grades (0-20)");
      return;
    }

    const parsedInputs = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, parseFloat(value)])
    );

    if (studentType === "regular") {
      // 1. Calculate Continuous Controls (25%)
      const continuousControls = ((parsedInputs.s1 + parsedInputs.s2) / 2) * 0.25;

      // 2. Calculate Regional Exam (25%)
      let regionalExam = 0;
      if (branch1 === "science") {
        const regionalTotal = 
          parsedInputs.fr * 4 + 
          parsedInputs.hg * 2 + 
          parsedInputs.islamic * 2 + 
          parsedInputs.ar * 2;
        const regionalCoefSum = 4 + 2 + 2 + 2;
        regionalExam = (regionalTotal / regionalCoefSum) * 0.25;
      } else if (branch1 === "adab") {
        const regionalTotal = 
          parsedInputs.fr * 4 + 
          parsedInputs.islamic * 2 + 
          parsedInputs.math * 1;
        const regionalCoefSum = 4 + 2 + 1;
        regionalExam = (regionalTotal / regionalCoefSum) * 0.25;
      }

      // 3. Calculate National Exam (50%)
      let nationalExam = 0;
      if (branch1 === "science") {
        const coef = {
          svt: branch2 === "svt" ? 7 : 5,
          math: 7,
          pc: branch2 === "pc" ? 7 : 5,
          philo: 2,
          en: 2,
        };
        const nationalTotal = 
          parsedInputs.svt * coef.svt +
          parsedInputs.math * coef.math +
          parsedInputs.pc * coef.pc +
          parsedInputs.philo * coef.philo +
          parsedInputs.en * coef.en;
        const nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
        nationalExam = (nationalTotal / nationalCoefSum) * 0.50;
      } else if (branch1 === "adab") {
        const coef = branch2 === "lettres" 
          ? { ar: 4, en: 4, hg: 3, philo: 3 }
          : { ar: 3, en: 3, hg: 4, philo: 4 };
        const nationalTotal = 
          parsedInputs.ar * coef.ar +
          parsedInputs.en * coef.en +
          parsedInputs.hg * coef.hg +
          parsedInputs.philo * coef.philo;
        const nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
        nationalExam = (nationalTotal / nationalCoefSum) * 0.50;
      }

      const finalAverage = continuousControls + regionalExam + nationalExam;
      setFinalAverage(finalAverage.toFixed(2));
      setAdmitted(finalAverage >= 10);
    } else {
      // Independent student calculation
      let coefficients = {};
      let totalPoints = 0;
      let totalCoefficients = 0;

      if (branch1 === "science") {
        coefficients = {
          fr: 4,
          hg: 2,
          islamic: 2,
          ar: 2,
          sport: hasSport ? 1 : 0,
          svt: branch2 === "svt" ? 7 : 5,
          math: 7,
          pc: branch2 === "pc" ? 7 : 5,
          philo: 2,
          en: 2,
        };
      } else if (branch1 === "adab") {
        coefficients = {
          fr: 4,
          islamic: 2,
          math: 1,
          sport: hasSport ? 1 : 0,
          ar: branch2 === "lettres" ? 4 : 3,
          en: branch2 === "lettres" ? 4 : 3,
          hg: branch2 === "lettres" ? 3 : 4,
          philo: branch2 === "lettres" ? 3 : 4,
        };
      }

      for (const [subject, coef] of Object.entries(coefficients)) {
        if (parsedInputs[subject] !== undefined && coef > 0) {
          totalPoints += parsedInputs[subject] * coef;
          totalCoefficients += coef;
        }
      }

      const finalAverage = totalPoints / totalCoefficients;
      setFinalAverage(finalAverage.toFixed(2));
      setAdmitted(finalAverage >= 10);
    }
    
    setShowResults(true);
  };

  const renderInput = (name, label) => {
    const value = inputs[name] || "";
    return (
      <div className="input-group">
        <label htmlFor={name}>{label}</label>
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
  };

  if (showResults) {
    return (
      <div className="container">
        <div className="results-screen">
          <h2>YOUR RESULT</h2>
          <div className="final-score">
            {finalAverage} <span className="score-max">/20</span>
          </div>
          <p className={`result-message ${admitted ? "success" : "error"}`}>
            {admitted ? "Congratulations! You are admitted" : "Unfortunately, you are not admitted"}
          </p>
          <button 
            className="reset-btn"
            onClick={handleReset}
          >
            Start New Calculation
          </button>
        </div>
        
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
            <button 
              className="btn" 
              onClick={studentType === "regular" ? handleNext : calcAverage}
            >
              {studentType === "regular" ? "Next" : "Calculate Average"}
            </button>
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