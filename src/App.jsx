import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [branch1, setBranch1] = useState("");
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState({});
  const [finalAverage, setFinalAverage] = useState(null);
  const [admitted, setAdmitted] = useState(null);
  const [branch2, setBranch2] = useState("");
  const [hasControls, setHasControls] = useState(null);

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
    let total_s1_s2 = hasControls
      ? (parsedInputs.s1 + parsedInputs.s2) / 2
      : null;

    if (branch1 === "science") {
      const total1 =
        parsedInputs.fr * 4 +
        parsedInputs.hg * 2 +
        parsedInputs.islamic * 2 +
        parsedInputs.ar * 2;
      note_regio = total1 / 10;

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
      const total1 =
        parsedInputs.fr * 4 + parsedInputs.islamic * 2 + parsedInputs.math * 1;
      note_regio = total1 / 7;

      let coef = {
        ar: branch2 === "lettres" ? 4 : 2,
        en: branch2 === "lettres" ? 4 : 2,
        hg: branch2 === "lettres" ? 2 : 4,
        philo: branch2 === "lettres" ? 2 : 4,
      };

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
      <input
        name={name}
        placeholder={label}
        value={value}
        onChange={handleChange}
        type="text"
      />
    );
  };

  const handleReset = () => {
    setBranch1("");
    setBranch2("");
    setStep(1);
    setInputs({});
    setFinalAverage(null);
    setAdmitted(null);
    setHasControls(null);
  };

  return (
    <div className="container">
      <h1>Baccalaureate Average Calculator</h1>

      {step === 1 && (
        <>
          <p>Choose your branch:</p>
          <button
            className="btn"
            onClick={() => {
              setBranch1("science");
              handleNext();
            }}
          >
            Science
          </button>
          <button
            className="btn"
            onClick={() => {
              setBranch1("adab");
              handleNext();
            }}
          >
            Adab
          </button>
        </>
      )}

      {step === 2 && (
        <>
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
          <button className="btn back" onClick={handleBack}>
            Back
          </button>
          <button className="btn" onClick={handleNext}>
            Next
          </button>
        </>
      )}

      {step === 3 && (
        <>
          {branch1 === "science" ? (
            <>
              <p>Choose your scientific stream:</p>
              <button
                className="btn"
                onClick={() => {
                  setBranch2("svt");
                  handleNext();
                }}
              >
                SVT
              </button>
              <button
                className="btn"
                onClick={() => {
                  setBranch2("pc");
                  handleNext();
                }}
              >
                PC
              </button>
            </>
          ) : (
            <>
              <p>Choose your literature stream:</p>
              <button
                className="btn"
                onClick={() => {
                  setBranch2("lettres");
                  handleNext();
                }}
              >
                Lettres
              </button>
              <button
                className="btn"
                onClick={() => {
                  setBranch2("science humain");
                  handleNext();
                }}
              >
                Science Humain
              </button>
            </>
          )}
          <button className="btn back" onClick={handleBack}>
            Back
          </button>
        </>
      )}

      {step === 4 && (
        <>
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

          <p>Do you have continuous controls?</p>
          <button
            className="btn"
            onClick={() => {
              setHasControls(true);
              handleNext();
            }}
          >
            Yes
          </button>
          <button
            className="btn"
            onClick={() => {
              setHasControls(false);
              handleNext();
            }}
          >
            No
          </button>
          <button className="btn back" onClick={handleBack}>
            Back
          </button>
        </>
      )}

      {step === 5 && hasControls && (
        <>
          {renderInput("s1", "Semester 1")}
          {renderInput("s2", "Semester 2")}
          <button className="btn back" onClick={handleBack}>
            Back
          </button>
          <button className="btn" onClick={calcAverage}>
            Calculate
          </button>
        </>
      )}

      {step === 5 && hasControls === false && (
        <>
          <button className="btn back" onClick={handleBack}>
            Back
          </button>
          <button className="btn" onClick={calcAverage}>
            Calculate
          </button>
        </>
      )}

      {finalAverage !== null && (
        <div>
          <p>
            Final Baccalaureate Average: <strong>{finalAverage}</strong>
          </p>
          <p>{admitted ? "✅ Admitted" : "❌ Not Admitted"}</p>
          <button className="btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
