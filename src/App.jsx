import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [branch1, setBranch1] = useState("");
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState({});
  const [finalAverage, setFinalAverage] = useState(null);
  const [admitted, setAdmitted] = useState(null);
  const [branch2, setBranch2] = useState("");

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleNext = () => setStep(step + 1);

  const calcAverage = () => {
    let note_regio = 0,
      note_national = 0;
    let total_s1_s2 =
      inputs.s1 !== undefined ? (inputs.s1 + inputs.s2) / 2 : null;

    if (branch1 === "science") {
      const total1 =
        inputs.fr * 4 + inputs.hg * 2 + inputs.islamic * 2 + inputs.ar * 2;
      note_regio = total1 / 10;

      let coef = {
        svt: branch2 === "svt" ? 7 : 5,
        math: 7,
        pc: branch2 === "pc" ? 7 : 5,
        philo: 2,
        en: 2,
      };

      const total2 =
        inputs.svt * coef.svt +
        inputs.math * coef.math +
        inputs.pc * coef.pc +
        inputs.philo * coef.philo +
        inputs.en * coef.en;

      const totalCoef = Object.values(coef).reduce((a, b) => a + b);
      note_national = total2 / totalCoef;
    }

    if (branch1 === "adab") {
      const total1 = inputs.fr * 4 + inputs.islamic * 2 + inputs.math * 1;
      note_regio = total1 / 7;

      let coef = {
        ar: branch2 === "lettres" ? 4 : 2,
        en: branch2 === "lettres" ? 4 : 2,
        hg: branch2 === "lettres" ? 2 : 4,
        philo: branch2 === "lettres" ? 2 : 4,
      };

      const total2 =
        inputs.ar * coef.ar +
        inputs.en * coef.en +
        inputs.hg * coef.hg +
        inputs.philo * coef.philo;

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

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
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

      {step === 2 && branch1 === "science" && (
        <>
          <input name="fr" placeholder="French" onChange={handleChange} />
          <input
            name="hg"
            placeholder="History & Geography"
            onChange={handleChange}
          />
          <input name="islamic" placeholder="Islamic" onChange={handleChange} />
          <input name="ar" placeholder="Arabic" onChange={handleChange} />
          <button className="btn" onClick={handleNext}>
            Next
          </button>
        </>
      )}

      {step === 2 && branch1 === "adab" && (
        <>
          <input name="fr" placeholder="French" onChange={handleChange} />
          <input name="islamic" placeholder="Islamic" onChange={handleChange} />
          <input name="math" placeholder="Math" onChange={handleChange} />
          <button className="btn" onClick={handleNext}>
            Next
          </button>
        </>
      )}

      {step === 3 && branch1 === "science" && (
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
      )}

      {step === 3 && branch1 === "adab" && (
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

      {step === 4 && (
        <>
          {branch1 === "science" && (
            <>
              <input name="svt" placeholder="SVT" onChange={handleChange} />
              <input name="math" placeholder="Math" onChange={handleChange} />
              <input
                name="pc"
                placeholder="Physics-Chemistry"
                onChange={handleChange}
              />
              <input
                name="philo"
                placeholder="Philosophy"
                onChange={handleChange}
              />
              <input name="en" placeholder="English" onChange={handleChange} />
            </>
          )}
          {branch1 === "adab" && (
            <>
              <input name="ar" placeholder="Arabic" onChange={handleChange} />
              <input name="en" placeholder="English" onChange={handleChange} />
              <input
                name="hg"
                placeholder="History & Geography"
                onChange={handleChange}
              />
              <input
                name="philo"
                placeholder="Philosophy"
                onChange={handleChange}
              />
            </>
          )}
          <p>Do you have continuous controls?</p>
          <input name="s1" placeholder="Semester 1" onChange={handleChange} />
          <input name="s2" placeholder="Semester 2" onChange={handleChange} />
          <button className="btn" onClick={calcAverage}>
            Calculate
          </button>
        </>
      )}

      {finalAverage && (
        <div>
          <p>
            Final Baccalaureate Average: <strong>{finalAverage}</strong>
          </p>
          <p>{admitted ? "✅ Admitted" : "❌ Not Admitted"}</p>
        </div>
      )}
    </div>
  );
}
