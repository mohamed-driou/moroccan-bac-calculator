import React, { useState } from "react";
import "./App.css";

const APP_VERSION = {
  version: "1.1",
  build: Date.now(),
  env: import.meta.env.MODE,
};
console.log("Bac Calculator Version:", APP_VERSION);

export default function App() {
  const [studentType, setStudentType] = useState(null); // "independent" or "regular"
  const [branch1, setBranch1] = useState("");
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState({});
  const [finalAverage, setFinalAverage] = useState(null);
  const [admitted, setAdmitted] = useState(null);
  const [branch2, setBranch2] = useState("");
  const [hasControls, setHasControls] = useState(null);
  const [hasSport, setHasSport] = useState(null);

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
    setStep(step + 1);
    setFinalAverage(null);
    setAdmitted(null);
  };

  const handleBack = () => {
    setStep(step - 1);
    setFinalAverage(null);
    setAdmitted(null);
  };

  const calcAverage = () => {
    const parsedInputs = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, parseFloat(value)])
    );

    let note_regio = 0,
      note_national = 0;

    let total_s1_s2 =
      studentType === "regular" && hasControls
        ? (parsedInputs.s1 + parsedInputs.s2) / 2
        : null;

    if (branch1 === "science") {
      let total1 =
        parsedInputs.fr * 4 +
        parsedInputs.hg * 2 +
        parsedInputs.islamic * 2 +
        parsedInputs.ar * 2;

      if (studentType === "independent" && hasSport && parsedInputs.sport) {
        total1 += parsedInputs.sport * 1;
        note_regio = total1 / 11;
      } else {
        note_regio = total1 / 10;
      }

      let coef = {
        svt: branch2 === "svt" ? 7 : 5,
        math: 7,
        pc: branch2 === "pc" ? 7 : 5,
        philo: 2,
        en: 2,
      };

      const total2 =
        parsedInputs.svt * coef.svt +
        parsedInputs.math * coef.math +
        parsedInputs.pc * coef.pc +
        parsedInputs.philo * coef.philo +
        parsedInputs.en * coef.en;

      const totalCoef = Object.values(coef).reduce((a, b) => a + b);
      note_national = total2 / totalCoef;
    }

    if (branch1 === "adab") {
      let total1 =
        parsedInputs.fr * 4 +
        parsedInputs.islamic * 2 +
        parsedInputs.math * 1;

      if (studentType === "independent" && hasSport && parsedInputs.sport) {
        total1 += parsedInputs.sport * 1;
        note_regio = total1 / 8;
      } else {
        note_regio = total1 / 7;
      }

      let coef = {};
      if (branch2 === "lettres") {
        coef = {
          ar: 4,
          en: 4,
          hg: 3,
          philo: 3,
        };
      } else {
        coef = {
          ar: 3,
          en: 3,
          hg: 4,
          philo: 4,
        };
      }

      const total2 =
        parsedInputs.ar * coef.ar +
        parsedInputs.en * coef.en +
        parsedInputs.hg * coef.hg +
        parsedInputs.philo * coef.philo;

      const totalCoef = Object.values(coef).reduce((a, b) => a + b);
      note_national = total2 / totalCoef;
    }

    let moyenne_bac =
      total_s1_s2 !== null
        ? total_s1_s2 * 0.25 + note_regio * 0.25 + note_national * 0.5
        : note_regio * 0.25 + note_national * 0.75;

    setFinalAverage(moyenne_bac.toFixed(2));
    setAdmitted(moyenne_bac >= 10);
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
    setHasControls(null);
    setHasSport(null);
  };

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
                <button className="btn" onClick={() => setHasSport(true)}>Yes</button>
                <button className="btn" onClick={() => setHasSport(false)}>No</button>
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

          {studentType === "regular" ? (
            <div className="question-box">
              <p>Do you have continuous controls?</p>
              <div className="button-group">
                <button className="btn" onClick={() => { setHasControls(true); handleNext(); }}>
                  Yes
                </button>
                <button className="btn" onClick={() => { setHasControls(false); handleNext(); }}>
                  No
                </button>
              </div>
            </div>
          ) : (
            <div className="navigation-buttons">
              <button className="btn" onClick={handleNext}>
                Next
              </button>
            </div>
          )}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      )}

      {step === 5 && studentType === "regular" && hasControls === true && (
        <div className="step-content">
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

      {((step === 5 && studentType === "regular" && hasControls === false) ||
        (step === 5 && studentType === "independent")) && (
        <div className="step-content">
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

      {finalAverage !== null && (
        <div className="results">
          <p>Final Baccalaureate Average: <strong>{finalAverage}</strong></p>
          <p className={admitted ? "admitted" : "not-admitted"}>
            {admitted ? "✅ Congratulations! You are admitted" : "❌ Unfortunately, you are not admitted"}
          </p>
          <button className="btn-reset" onClick={handleReset}>
            Start New Calculation
          </button>
        </div>
      )}
    </div>
  );
}