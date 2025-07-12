import React, { useState, useEffect } from "react";
import "./App.css";
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import MainMenu from './components/MainMenu/MainMenu';
import { useTranslation } from "react-i18next";
import BacFormulaCalculator from './components/BacFormulaCalculator/BacCalculator';
import SupportPage from './components/SupportPage/SupportPage';

/**
 * Moroccan Baccalaureate Calculator
 * A React application for calculating baccalaureate scores according to Morocco's official grading system
 * 
 * Copyright (c) 2024 Mohamed Driou
 * @license MIT
 */

const APP_VERSION = {
  version: "2.0.4",
  build: Date.now(),
  lastUpdated: "July 11, 2025"
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
  const { t } = useTranslation();
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
        <p><strong>{t('coefficient')}:</strong> {coefficient}</p>
        {description && <p className="tooltip-description">{description}</p>}
      </div>
    </div>
  );
};

const getSubjectInfo = (branch1, branch2, t) => ({
  fr: {
    coefficient: branch1 === "economics" ? 3 : 
                branch1 === "math" ? 4 : 
                branch1 === "science" ? 4 : 
                branch1 === "science_tech" ? 4 :
                branch1 === "traditional" ? 3 :
                branch1 === "applied_arts" ? 4 :
                (branch2 === "lettres" ? 4 : 3),
    description: t('subjectDescriptions.french')
  },
  hg: {
    coefficient: branch1 === "science" || branch1 === "math" || branch1 === "science_tech" ? 2 : 
                branch1 === "economics" ? 2 : 
                branch1 === "traditional" ? (branch2 === "arabic_language" ? 3 : 2) :
                (branch2 === "lettres" ? 3 : 4),
    description: t('subjectDescriptions.historyGeography')
  },
  islamic: {
    coefficient: branch1 === "traditional" ? 0 : 
                branch1 === "applied_arts" ? 2 : 2,
    description: t('subjectDescriptions.islamic')
  },
  ar: {
    coefficient: branch1 === "science" || branch1 === "math" || branch1 === "science_tech" ? 2 : 
                branch1 === "economics" ? 2 : 
                branch1 === "applied_arts" ? 2 :
                (branch2 === "lettres" ? 4 : 3),
    description: t('subjectDescriptions.arabic')
  },
  math: {
    coefficient: branch1 === "science" ? 7 : 
                branch1 === "economics" ? 4 : 
                branch1 === "math" ? 9 : 
                branch1 === "science_tech" ? 7 :
                branch1 === "traditional" ? 1 :
                branch1 === "applied_arts" ? 2 :
                1,
    description: t('subjectDescriptions.math')
  },
  svt: {
    coefficient: branch2 === "svt" ? 7 : 
                branch2 === "math_a" ? 3 : 
                branch2 === "agricultural" ? 5 :
                5,
    description: t('subjectDescriptions.svt')
  },
  pc: {
    coefficient: branch2 === "pc" ? 7 : 
                branch1 === "math" ? 7 : 
                branch1 === "science_tech" ? 5 :
                5,
    description: t('subjectDescriptions.physicsChemistry')
  },
  plant_animal: {
    coefficient: branch2 === "agricultural" ? 5 : 0,
    description: t('subjectDescriptions.plantAnimal')
  },
  engineering: {
    coefficient: branch2 === "math_b" || branch2 === "mechanical_tech" || branch2 === "electrical_tech" ? 8 : 0,
    description: t('subjectDescriptions.engineering')
  },
  philo: {
    coefficient: branch1 === "science" || branch1 === "math" || branch1 === "science_tech" ? 2 : 
                branch1 === "economics" ? 2 : 
                branch1 === "traditional" ? 2 :
                branch1 === "applied_arts" ? 2 :
                (branch2 === "lettres" ? 3 : 4),
    description: t('subjectDescriptions.philosophy')
  },
  en: {
    coefficient: branch1 === "science" || branch1 === "math" || branch1 === "science_tech" ? 2 : 
                branch1 === "economics" ? 2 : 
                branch1 === "traditional" ? 2 :
                branch1 === "applied_arts" ? 2 :
                (branch2 === "lettres" ? 4 : 3),
    description: t('subjectDescriptions.english')
  },
  sport: {
    coefficient: 1,
    description: t('subjectDescriptions.sport')
  },
  translation: {
    coefficient: 2,
    description: t('subjectDescriptions.translation')
  },
  s1: {
    coefficient: t('varies'),
    description: t('subjectDescriptions.semester1')
  },
  s2: {
    coefficient: t('varies'),
    description: t('subjectDescriptions.semester2')
  },
  mis: {
    coefficient: 1,
    description: t('subjectDescriptions.mis')
  },
  accounting: {
    coefficient: branch2 === "economic_sciences" ? 4 : 6,
    description: t('subjectDescriptions.accounting')
  },
  general_economics: {
    coefficient: branch2 === "economic_sciences" ? 6 : 3,
    description: t('subjectDescriptions.generalEconomics')
  },
  economics: {
    coefficient: branch2 === "economic_sciences" ? 3 : 6,
    description: t('subjectDescriptions.economics')
  },
  law: {
    coefficient: 1,
    description: t('subjectDescriptions.law')
  },
  documentation: {
    coefficient: branch2 === "arabic_language" || branch2 === "islamic_studies" ? 1 : 0,
    description: t('subjectDescriptions.documentation')
  },
  linguistics: {
    coefficient: branch2 === "arabic_language" ? 4 : 
                branch2 === "islamic_studies" ? 2 : 0,
    description: t('subjectDescriptions.linguistics')
  },
  faraid: {
    coefficient: branch2 === "islamic_studies" ? 2 : 0,
    description: t('subjectDescriptions.faraid')
  },
  literature: {
    coefficient: branch2 === "arabic_language" ? 5 : 
                branch2 === "islamic_studies" ? 4 : 0,
    description: t('subjectDescriptions.literature')
  },
  interpretation: {
    coefficient: branch2 === "arabic_language" ? 4 : 
                branch2 === "islamic_studies" ? 5 : 0,
    description: t('subjectDescriptions.interpretation')
  },
  fiqh: {
    coefficient: branch2 === "islamic_studies" ? 5 : 0,
    description: t('subjectDescriptions.fiqh')
  },
  it_geo: {
    coefficient: 2,
    description: t('subjectDescriptions.itGeo')
  },
  visual_arts: {
    coefficient: 2,
    description: t('subjectDescriptions.visualArts')
  },
  product_design: {
    coefficient: 5,
    description: t('subjectDescriptions.productDesign')
  },
  multimedia_design: {
    coefficient: 8,
    description: t('subjectDescriptions.multimediaDesign')
  },
  env_design: {
    coefficient: 5,
    description: t('subjectDescriptions.envDesign')
  }
});

function BacAverageByStream({ onBack }) {
  const { t } = useTranslation();
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
  const [hasITGeo, setHasITGeo] = useState(null);
  const [hasVisualArts, setHasVisualArts] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [calculationSteps, setCalculationSteps] = useState([]);
  const [continuousControlNote, setContinuousControlNote] = useState(null);
  const [regionalExamNote, setRegionalExamNote] = useState(null);
  const [nationalExamNote, setNationalExamNote] = useState(null);
  const [selectedValues, setSelectedValues] = useState({});
  
  const breadcrumbSteps = [
    { label: t('studentType'), valueKey: 'studentType' },
    { label: t('branch'), valueKey: 'branch1' },
    { label: t('regionalExam'), valueKey: null },
    ...(branch1 === 'science' || branch1 === 'economics' || branch1 === 'math' || 
        branch1 === 'science_tech' || branch1 === 'traditional' || branch1 === 'adab' || 
        branch1 === 'applied_arts' ? 
        [{ label: t('track'), valueKey: 'branch2' }] : []),
    { label: t('nationalExam'), valueKey: null },
    ...(studentType === 'regular' ? [{ label: t('controls'), valueKey: null }] : [])
  ];

  const subjectInfo = getSubjectInfo(branch1, branch2, t);

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
    if (step === 2 && (branch1 === "economics" || branch1 === "math" || branch1 === "science_tech" || branch1 === "traditional" || branch1 === "applied_arts")) {
      if (branch1 === "economics") {
        if (hasMIS === null) {
          alert(t('alerts.misRequired'));
          return;
        }
        if (hasLaw === null) {
          alert(t('alerts.lawRequired'));
          return;
        }
      }
      if (studentType === "independent" && hasSport === null && branch1 !== "traditional") {
        alert(t('alerts.sportRequired'));
        return;
      }
      if (branch1 === "applied_arts") {
        if (hasITGeo === null) {
          alert(t('alerts.itGeoRequired'));
          return;
        }
        if (hasVisualArts === null) {
          alert(t('alerts.visualArtsRequired'));
          return;
        }
      }
    }
    if (step === 2 && hasTranslation === null && (branch1 === "science" || branch1 === "adab" || branch1 === "math" || branch1 === "science_tech")) {
      alert(t('alerts.translationRequired'));
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
    setHasITGeo(null);
    setHasVisualArts(null);
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
      if (branch2 === "agricultural") requiredFields.push("svt", "plant_animal");
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
    } else if (branch1 === "math") {
      requiredFields.push("ar", "fr", "islamic", "hg");
      if (hasTranslation === true) {
        requiredFields.push("translation");
      }
      if (studentType === "independent" && hasSport === true) {
        requiredFields.push("sport");
      }
      requiredFields.push("math", "pc");
      if (branch2 === "math_a") {
        requiredFields.push("svt");
      } else if (branch2 === "math_b") {
        requiredFields.push("engineering");
      }
      requiredFields.push("philo", "en");
    } else if (branch1 === "science_tech") {
      requiredFields.push("ar", "fr", "islamic");
      if (hasTranslation === true) {
        requiredFields.push("translation");
      }
      if (studentType === "independent" && hasSport === true) {
        requiredFields.push("sport");
      }
      requiredFields.push("math", "pc", "engineering", "philo", "en");
    } else if (branch1 === "traditional") {
      requiredFields.push("fr", "hg", "math", "documentation");
      if (branch2 === "arabic_language") {
        requiredFields.push("linguistics", "literature", "interpretation", "en", "philo");
      } else if (branch2 === "islamic_studies") {
        requiredFields.push("linguistics", "faraid", "literature", "interpretation", "fiqh", "en", "philo");
      }
      if (studentType === "independent" && hasSport === true) {
        requiredFields.push("sport");
      }
    } else if (branch1 === "applied_arts") {
      requiredFields.push("math", "fr", "islamic", "ar");
      if (hasITGeo === true) requiredFields.push("it_geo");
      if (hasVisualArts === true) requiredFields.push("visual_arts");
      if (studentType === "independent" && hasSport === true) {
        requiredFields.push("sport");
      }
      if (branch2 === "applied_arts_track") {
        requiredFields.push("product_design", "multimedia_design", "env_design", "en", "philo");
      }
    }

    if (studentType === "regular" && step === (branch1 === "math" || branch1 === "science_tech" || branch1 === "traditional" || branch1 === "applied_arts" ? 4 : 5)) {
      requiredFields.push("s1", "s2");
    }
    
    return requiredFields.every(field => {
      const value = inputs[field];
      return value !== undefined && value !== "" && !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 20;
    });
  };

  const calcAverage = () => {
    if (!validateInputs()) {
      alert(t('alerts.invalidInputs'));
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
          title: t('calculationSteps.continuousControls'),
          value: continuousControls.toFixed(2),
          details: t('calculationDetails.continuousControls', {
            s1: parsedInputs.s1,
            s2: parsedInputs.s2,
            avg: continuousAvg.toFixed(2)
          })
        });

        // Regional Exam (25%)
        let regionalExam = 0;
        let regionalAvg = 0;
        
        if (branch1 === "traditional") {
          let regionalTotal = parsedInputs.fr * 3 + 
                           parsedInputs.hg * (branch2 === "arabic_language" ? 3 : 2) + 
                           parsedInputs.math * 1 + 
                           parsedInputs.documentation * 1;
          
          if (branch2 === "islamic_studies") {
            regionalTotal += parsedInputs.linguistics * 2 + parsedInputs.faraid * 2;
          }
          
          let regionalCoefSum = branch2 === "arabic_language" ? 8 : 
                                branch2 === "islamic_studies" ? 11 : 10;
          
          if (hasSport === true) {
            regionalTotal += parsedInputs.sport * 1;
            regionalCoefSum += 1;
          }

          const regionalAvg = regionalTotal / regionalCoefSum;
          regionalExam = regionalAvg * 0.25;
          
          let details = t('calculationDetails.traditionalRegional', {
            fr: parsedInputs.fr,
            hg: parsedInputs.hg,
            hgCoef: branch2 === "arabic_language" ? 3 : 2,
            math: parsedInputs.math,
            doc: parsedInputs.documentation,
            ...(branch2 === "islamic_studies" ? {
              ling: parsedInputs.linguistics,
              faraid: parsedInputs.faraid
            } : {}),
            ...(hasSport === true ? { sport: parsedInputs.sport } : {}),
            coefSum: regionalCoefSum,
            avg: regionalAvg.toFixed(2)
          });
          
          steps.push({
            title: t('calculationSteps.regionalExam'),
            value: regionalExam.toFixed(2),
            details: details
          });
        } 
        else if (branch1 === "applied_arts") {
          let regionalTotal = parsedInputs.math * 2 + 
                            parsedInputs.fr * 4 + 
                            parsedInputs.islamic * 2 + 
                            parsedInputs.ar * 2;
          let regionalCoefSum = 2 + 4 + 2 + 2;
          
          if (hasITGeo === true) {
            regionalTotal += parsedInputs.it_geo * 2;
            regionalCoefSum += 2;
          }
          
          if (hasVisualArts === true) {
            regionalTotal += parsedInputs.visual_arts * 2;
            regionalCoefSum += 2;
          }

          regionalAvg = regionalTotal / regionalCoefSum;
          regionalExam = regionalAvg * 0.25;
          
          let details = t('calculationDetails.appliedArtsRegional', {
            math: parsedInputs.math,
            fr: parsedInputs.fr,
            isl: parsedInputs.islamic,
            ar: parsedInputs.ar,
            ...(hasITGeo === true ? { itGeo: parsedInputs.it_geo } : {}),
            ...(hasVisualArts === true ? { visualArts: parsedInputs.visual_arts } : {}),
            coefSum: regionalCoefSum,
            avg: regionalAvg.toFixed(2)
          });
          
          steps.push({
            title: t('calculationSteps.regionalExam'),
            value: regionalExam.toFixed(2),
            details: details
          });
        }
        else if (branch1 === "science") {
          let regionalTotal = parsedInputs.fr * 4 + parsedInputs.hg * 2 + parsedInputs.islamic * 2 + parsedInputs.ar * 2;
          let regionalCoefSum = 4 + 2 + 2 + 2;
          if (hasTranslation) {
            regionalTotal += parsedInputs.translation * 2;
            regionalCoefSum += 2;
          }
          regionalAvg = regionalTotal / regionalCoefSum;
          regionalExam = regionalAvg * 0.25;
          steps.push({
            title: t('calculationSteps.regionalExam'),
            value: regionalExam.toFixed(2),
            details: t('calculationDetails.scienceRegional', {
              fr: parsedInputs.fr,
              hg: parsedInputs.hg,
              isl: parsedInputs.islamic,
              ar: parsedInputs.ar,
              ...(hasTranslation ? { trans: parsedInputs.translation } : {}),
              coefSum: regionalCoefSum,
              avg: regionalAvg.toFixed(2)
            })
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
            title: t('calculationSteps.regionalExam'),
            value: regionalExam.toFixed(2),
            details: t('calculationDetails.adabRegional', {
              fr: parsedInputs.fr,
              isl: parsedInputs.islamic,
              math: parsedInputs.math,
              ...(hasTranslation ? { trans: parsedInputs.translation } : {}),
              coefSum: regionalCoefSum,
              avg: regionalAvg.toFixed(2)
            })
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
          
          let details = t('calculationDetails.economicsRegional', {
            ar: parsedInputs.ar,
            fr: parsedInputs.fr,
            isl: parsedInputs.islamic,
            hg: parsedInputs.hg,
            ...(hasMIS === true ? { mis: parsedInputs.mis } : {}),
            ...(hasLaw === true ? { law: parsedInputs.law } : {}),
            coefSum: regionalCoefSum,
            avg: regionalAvg.toFixed(2)
          });
          
          steps.push({
            title: t('calculationSteps.regionalExam'),
            value: regionalExam.toFixed(2),
            details: details
          });
        } else if (branch1 === "math") {
          let regionalTotal = parsedInputs.ar * 2 + parsedInputs.fr * 4 + 
                            parsedInputs.islamic * 2 + parsedInputs.hg * 2;
          let regionalCoefSum = 2 + 4 + 2 + 2;
          
          if (hasTranslation === true) {
            regionalTotal += parsedInputs.translation * 2;
            regionalCoefSum += 2;
          }
          
          if (studentType === "independent" && hasSport === true) {
            regionalTotal += parsedInputs.sport * 1;
            regionalCoefSum += 1;
          }

          regionalAvg = regionalTotal / regionalCoefSum;
          regionalExam = regionalAvg * 0.25;
          
          let details = t('calculationDetails.mathRegional', {
            ar: parsedInputs.ar,
            fr: parsedInputs.fr,
            isl: parsedInputs.islamic,
            hg: parsedInputs.hg,
            ...(hasTranslation === true ? { trans: parsedInputs.translation } : {}),
            ...(studentType === "independent" && hasSport === true ? { sport: parsedInputs.sport } : {}),
            coefSum: regionalCoefSum,
            avg: regionalAvg.toFixed(2)
          });
          
          steps.push({
            title: t('calculationSteps.regionalExam'),
            value: regionalExam.toFixed(2),
            details: details
          });
        } else if (branch1 === "science_tech") {
          let regionalTotal = parsedInputs.ar * 2 + parsedInputs.fr * 4 + 
                            parsedInputs.islamic * 2;
          let regionalCoefSum = 2 + 4 + 2;
          
          if (hasTranslation === true) {
            regionalTotal += parsedInputs.translation * 2;
            regionalCoefSum += 2;
          }

          regionalAvg = regionalTotal / regionalCoefSum;
          regionalExam = regionalAvg * 0.25;
          
          let details = t('calculationDetails.scienceTechRegional', {
            ar: parsedInputs.ar,
            fr: parsedInputs.fr,
            isl: parsedInputs.islamic,
            ...(hasTranslation === true ? { trans: parsedInputs.translation } : {}),
            coefSum: regionalCoefSum,
            avg: regionalAvg.toFixed(2)
          });
          
          steps.push({
            title: t('calculationSteps.regionalExam'),
            value: regionalExam.toFixed(2),
            details: details
          });
        }
        setRegionalExamNote(regionalAvg.toFixed(2));

        // National Exam (50%)
        let nationalExam = 0;
        let nationalAvg = 0;
        
        if (branch1 === "traditional" && branch2 === "arabic_language") {
          const nationalTotal = parsedInputs.linguistics * 4 + 
                              parsedInputs.literature * 5 + 
                              parsedInputs.interpretation * 4 + 
                              parsedInputs.en * 2 + 
                              parsedInputs.philo * 2;
          const nationalCoefSum = 4 + 5 + 4 + 2 + 2;
          nationalAvg = nationalTotal / nationalCoefSum;
          nationalExam = nationalAvg * 0.50;
          
          steps.push({
            title: t('calculationSteps.nationalExam'),
            value: nationalExam.toFixed(2),
            details: t('calculationDetails.traditionalArabicNational', {
              ling: parsedInputs.linguistics,
              lit: parsedInputs.literature,
              interp: parsedInputs.interpretation,
              en: parsedInputs.en,
              philo: parsedInputs.philo,
              coefSum: nationalCoefSum,
              avg: nationalAvg.toFixed(2)
            })
          });
        } else if (branch1 === "traditional" && branch2 === "islamic_studies") {
          const nationalTotal = parsedInputs.literature * 4 + 
                              parsedInputs.interpretation * 5 + 
                              parsedInputs.fiqh * 5 + 
                              parsedInputs.en * 2 + 
                              parsedInputs.philo * 2;
          const nationalCoefSum = 4 + 5 + 5 + 2 + 2;
          nationalAvg = nationalTotal / nationalCoefSum;
          nationalExam = nationalAvg * 0.50;
          
          steps.push({
            title: t('calculationSteps.nationalExam'),
            value: nationalExam.toFixed(2),
            details: t('calculationDetails.traditionalIslamicNational', {
              lit: parsedInputs.literature,
              interp: parsedInputs.interpretation,
              fiqh: parsedInputs.fiqh,
              en: parsedInputs.en,
              philo: parsedInputs.philo,
              coefSum: nationalCoefSum,
              avg: nationalAvg.toFixed(2)
            })
          });
        }
        else if (branch1 === "applied_arts") {
          const nationalTotal = parsedInputs.product_design * 5 + 
                               parsedInputs.multimedia_design * 8 + 
                               parsedInputs.env_design * 5 + 
                               parsedInputs.en * 2 + 
                               parsedInputs.philo * 2;
          const nationalCoefSum = 5 + 8 + 5 + 2 + 2;
          nationalAvg = nationalTotal / nationalCoefSum;
          nationalExam = nationalAvg * 0.50;
          
          steps.push({
            title: t('calculationSteps.nationalExam'),
            value: nationalExam.toFixed(2),
            details: t('calculationDetails.appliedArtsNational', {
              product: parsedInputs.product_design,
              multimedia: parsedInputs.multimedia_design,
              env: parsedInputs.env_design,
              en: parsedInputs.en,
              philo: parsedInputs.philo,
              coefSum: nationalCoefSum,
              avg: nationalAvg.toFixed(2)
            })
          });
        }
        else if (branch1 === "science") {
          let coef;
          if (branch2 === "svt") {
            coef = {
              svt: 7,
              math: 7,
              pc: 5,
              philo: 2,
              en: 2
            };
          } else if (branch2 === "pc") {
            coef = {
              svt: 5,
              math: 7,
              pc: 7,
              philo: 2,
              en: 2
            };
          } else if (branch2 === "agricultural") {
            coef = {
              math: 7,
              pc: 5,
              svt: 5,
              plant_animal: 5,
              philo: 2,
              en: 2
            };
          }
          
          const nationalTotal = parsedInputs.math * coef.math + 
                              (branch2 === "agricultural" ? parsedInputs.plant_animal * coef.plant_animal : parsedInputs.svt * coef.svt) + 
                              parsedInputs.pc * coef.pc + 
                              parsedInputs.philo * coef.philo + 
                              parsedInputs.en * coef.en;
          const nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
          nationalAvg = nationalTotal / nationalCoefSum;
          nationalExam = nationalAvg * 0.50;
          
          let details = t(`calculationDetails.scienceNational.${branch2}`, {
            math: parsedInputs.math,
            mathCoef: coef.math,
            ...(branch2 === "agricultural" ? {
              plantAnimal: parsedInputs.plant_animal,
              plantAnimalCoef: coef.plant_animal
            } : {
              svt: parsedInputs.svt,
              svtCoef: coef.svt
            }),
            pc: parsedInputs.pc,
            pcCoef: coef.pc,
            philo: parsedInputs.philo,
            en: parsedInputs.en,
            coefSum: nationalCoefSum,
            avg: nationalAvg.toFixed(2)
          });
          
          steps.push({
            title: t('calculationSteps.nationalExam'),
            value: nationalExam.toFixed(2),
            details: details
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
            title: t('calculationSteps.nationalExam'),
            value: nationalExam.toFixed(2),
            details: t('calculationDetails.adabNational', {
              ar: parsedInputs.ar,
              arCoef: coef.ar,
              en: parsedInputs.en,
              enCoef: coef.en,
              hg: parsedInputs.hg,
              hgCoef: coef.hg,
              philo: parsedInputs.philo,
              philoCoef: coef.philo,
              coefSum: nationalCoefSum,
              avg: nationalAvg.toFixed(2)
            })
          });
        } else if (branch1 === "economics") {
          const coef = branch2 === "accounting" 
            ? { // Accounting Management Sciences coefficients
                math: 4,
                accounting: 6,
                general_economics: 3,
                economics: 6,
                philo: 2,
                en: 2
              }
            : { // Economic Sciences coefficients
                math: 4,
                accounting: 4,
                general_economics: 6,
                economics: 3,
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
            title: t('calculationSteps.nationalExam'),
            value: nationalExam.toFixed(2),
            details: t('calculationDetails.economicsNational', {
              math: parsedInputs.math,
              mathCoef: coef.math,
              account: parsedInputs.accounting,
              accountCoef: coef.accounting,
              genEcon: parsedInputs.general_economics,
              genEconCoef: coef.general_economics,
              econ: parsedInputs.economics,
              econCoef: coef.economics,
              philo: parsedInputs.philo,
              en: parsedInputs.en,
              coefSum: nationalCoefSum,
              avg: nationalAvg.toFixed(2)
            })
          });
        } else if (branch1 === "math") {
          const coef = branch2 === "math_a" 
            ? { // Mathematical Sciences A coefficients
                math: 9,
                pc: 7,
                svt: 3,
                philo: 2,
                en: 2
              }
            : { // Mathematical Sciences B coefficients
                math: 9,
                pc: 7,
                engineering: 3,
                philo: 2,
                en: 2
              };
          
          const nationalTotal = parsedInputs.math * coef.math + 
                              parsedInputs.pc * coef.pc + 
                              (branch2 === "math_a" ? parsedInputs.svt * coef.svt : parsedInputs.engineering * coef.engineering) + 
                              parsedInputs.philo * coef.philo + 
                              parsedInputs.en * coef.en;
          const nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
          nationalAvg = nationalTotal / nationalCoefSum;
          nationalExam = nationalAvg * 0.50;
          
          steps.push({
            title: t('calculationSteps.nationalExam'),
            value: nationalExam.toFixed(2),
            details: t('calculationDetails.mathNational', {
              math: parsedInputs.math,
              mathCoef: coef.math,
              pc: parsedInputs.pc,
              pcCoef: coef.pc,
              ...(branch2 === "math_a" ? {
                svt: parsedInputs.svt,
                svtCoef: coef.svt
              } : {
                eng: parsedInputs.engineering,
                engCoef: coef.engineering
              }),
              philo: parsedInputs.philo,
              en: parsedInputs.en,
              coefSum: nationalCoefSum,
              avg: nationalAvg.toFixed(2)
            })
          });
        } else if (branch1 === "science_tech") {
          const coef = {
            math: 7,
            pc: 5,
            engineering: 8,
            philo: 2,
            en: 2
          };
          
          const nationalTotal = parsedInputs.math * coef.math + 
                              parsedInputs.pc * coef.pc + 
                              parsedInputs.engineering * coef.engineering + 
                              parsedInputs.philo * coef.philo + 
                              parsedInputs.en * coef.en;
          const nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
          nationalAvg = nationalTotal / nationalCoefSum;
          nationalExam = nationalAvg * 0.50;
          
          steps.push({
            title: t('calculationSteps.nationalExam'),
            value: nationalExam.toFixed(2),
            details: t('calculationDetails.scienceTechNational', {
              math: parsedInputs.math,
              pc: parsedInputs.pc,
              eng: parsedInputs.engineering,
              philo: parsedInputs.philo,
              en: parsedInputs.en,
              coefSum: nationalCoefSum,
              avg: nationalAvg.toFixed(2)
            })
          });
        }
        setNationalExamNote(nationalAvg.toFixed(2));

        // Final average calculation
        finalAverage = continuousControls + regionalExam + nationalExam;
        
        steps.push({
          title: t('calculationSteps.finalAverage'),
          value: finalAverage.toFixed(2),
          details: t('calculationDetails.finalAverage', {
            continuous: continuousControls.toFixed(2),
            regional: regionalExam.toFixed(2),
            national: nationalExam.toFixed(2)
          })
        });

        setCalculationSteps(steps);
      } else {
        // Independent candidate calculation
        setContinuousControlNote(null);

        // Regional Exam (8/22 weight)
        let regionalTotal = 0;
        let regionalCoefSum = 0;
        
        if (branch1 === "traditional" && branch2 === "islamic_studies") {
          let regionalTotal = parsedInputs.fr * 3 + 
                            parsedInputs.hg * 2 + 
                            parsedInputs.math * 1 + 
                            parsedInputs.documentation * 1 +
                            parsedInputs.linguistics * 2 + 
                            parsedInputs.faraid * 2;
          
          let regionalCoefSum = 11;
          
          if (hasSport === true) {
            regionalTotal += parsedInputs.sport * 1;
            regionalCoefSum += 1;
          }

          const regionalAvg = regionalTotal / regionalCoefSum;
          
          steps.push({
            title: t('calculationSteps.independentRegional'),
            value: regionalAvg.toFixed(2),
            details: t('calculationDetails.independentTraditionalIslamicRegional', {
              fr: parsedInputs.fr,
              hg: parsedInputs.hg,
              math: parsedInputs.math,
              doc: parsedInputs.documentation,
              ling: parsedInputs.linguistics,
              faraid: parsedInputs.faraid,
              ...(hasSport === true ? { sport: parsedInputs.sport } : {}),
              coefSum: regionalCoefSum
            })
          });
        }
        else if (branch1 === "applied_arts") {
          regionalTotal = parsedInputs.math * 2 + 
                        parsedInputs.fr * 4 + 
                        parsedInputs.islamic * 2 + 
                        parsedInputs.ar * 2;
          regionalCoefSum = 2 + 4 + 2 + 2;
          
          if (hasITGeo === true) {
            regionalTotal += parsedInputs.it_geo * 2;
            regionalCoefSum += 2;
          }
          
          if (hasVisualArts === true) {
            regionalTotal += parsedInputs.visual_arts * 2;
            regionalCoefSum += 2;
          }
          
          if (hasSport === true) {
            regionalTotal += parsedInputs.sport * 1;
            regionalCoefSum += 1;
          }
        }
        else if (branch1 === "traditional") {
          regionalTotal = parsedInputs.fr * 3 + 
                        parsedInputs.hg * (branch2 === "arabic_language" ? 3 : 2) + 
                        parsedInputs.math * 1 + 
                        parsedInputs.documentation * 1;
          
          if (branch2 === "islamic_studies") {
            regionalTotal += parsedInputs.linguistics * 2 + parsedInputs.faraid * 2;
          }
          
          regionalCoefSum = branch2 === "arabic_language" ? 8 : 
                           branch2 === "islamic_studies" ? 11 : 10;
          
          if (hasSport === true) {
            regionalTotal += parsedInputs.sport * 1;
            regionalCoefSum += 1;
          }
        }
        else if (branch1 === "science") {
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
        } else if (branch1 === "math") {
          regionalTotal = parsedInputs.ar * 2 + parsedInputs.fr * 4 + 
                         parsedInputs.islamic * 2 + parsedInputs.hg * 2;
          regionalCoefSum = 2 + 4 + 2 + 2;
          
          if (hasTranslation === true) {
            regionalTotal += parsedInputs.translation * 2;
            regionalCoefSum += 2;
          }
          
          if (hasSport === true) {
            regionalTotal += parsedInputs.sport * 1;
            regionalCoefSum += 1;
          }
        } else if (branch1 === "science_tech") {
          regionalTotal = parsedInputs.ar * 2 + parsedInputs.fr * 4 + 
                         parsedInputs.islamic * 2;
          regionalCoefSum = 2 + 4 + 2;
          
          if (hasTranslation === true) {
            regionalTotal += parsedInputs.translation * 2;
            regionalCoefSum += 2;
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
        
        if (branch1 === "traditional" && branch2 === "arabic_language") {
          nationalTotal = parsedInputs.linguistics * 4 + 
                         parsedInputs.literature * 5 + 
                         parsedInputs.interpretation * 4 + 
                         parsedInputs.en * 2 + 
                         parsedInputs.philo * 2;
          nationalCoefSum = 4 + 5 + 4 + 2 + 2;
        } else if (branch1 === "traditional" && branch2 === "islamic_studies") {
          nationalTotal = parsedInputs.literature * 4 + 
                         parsedInputs.interpretation * 5 + 
                         parsedInputs.fiqh * 5 + 
                         parsedInputs.en * 2 + 
                         parsedInputs.philo * 2;
          nationalCoefSum = 4 + 5 + 5 + 2 + 2;
        }
        else if (branch1 === "applied_arts") {
          nationalTotal = parsedInputs.product_design * 5 + 
                         parsedInputs.multimedia_design * 8 + 
                         parsedInputs.env_design * 5 + 
                         parsedInputs.en * 2 + 
                         parsedInputs.philo * 2;
          nationalCoefSum = 5 + 8 + 5 + 2 + 2;
        }
        else if (branch1 === "science") {
          let coef;
          if (branch2 === "svt") {
            coef = {
              svt: 7,
              math: 7,
              pc: 5,
              philo: 2,
              en: 2
            };
          } else if (branch2 === "pc") {
            coef = {
              svt: 5,
              math: 7,
              pc: 7,
              philo: 2,
              en: 2
            };
          } else if (branch2 === "agricultural") {
            coef = {
              math: 7,
              pc: 5,
              svt: 5,
              plant_animal: 5,
              philo: 2,
              en: 2
            };
          }
          
          nationalTotal = parsedInputs.math * coef.math + 
                         (branch2 === "agricultural" ? parsedInputs.plant_animal * coef.plant_animal : parsedInputs.svt * coef.svt) + 
                         parsedInputs.pc * coef.pc + 
                         parsedInputs.philo * coef.philo + 
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
          const coef = branch2 === "accounting" 
            ? { // Accounting Management Sciences coefficients
                math: 4,
                accounting: 6,
                general_economics: 3,
                economics: 6,
                philo: 2,
                en: 2
              }
            : { // Economic Sciences coefficients
                math: 4,
                accounting: 4,
                general_economics: 6,
                economics: 3,
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
        } else if (branch1 === "math") {
          const coef = branch2 === "math_a" 
            ? { // Mathematical Sciences A coefficients
                math: 9,
                pc: 7,
                svt: 3,
                philo: 2,
                en: 2
              }
            : { // Mathematical Sciences B coefficients
                math: 9,
                pc: 7,
                engineering: 3,
                philo: 2,
                en: 2
              };
          
          nationalTotal = parsedInputs.math * coef.math + 
                         parsedInputs.pc * coef.pc + 
                         (branch2 === "math_a" ? parsedInputs.svt * coef.svt : parsedInputs.engineering * coef.engineering) + 
                         parsedInputs.philo * coef.philo + 
                         parsedInputs.en * coef.en;
          nationalCoefSum = Object.values(coef).reduce((a, b) => a + b);
        } else if (branch1 === "science_tech") {
          const coef = {
            math: 7,
            pc: 5,
            engineering: 8,
            philo: 2,
            en: 2
          };
          
          nationalTotal = parsedInputs.math * coef.math + 
                         parsedInputs.pc * coef.pc + 
                         parsedInputs.engineering * coef.engineering + 
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
            title: t('calculationSteps.independentRegional'),
            value: regionalAvg.toFixed(2),
            details: branch1 === "traditional" 
              ? t(`calculationDetails.independent${branch2 === "arabic_language" ? "Arabic" : "Islamic"}Regional`, {
                fr: parsedInputs.fr,
                hg: parsedInputs.hg,
                math: parsedInputs.math,
                doc: parsedInputs.documentation,
                ...(branch2 === "islamic_studies" ? {
                  ling: parsedInputs.linguistics,
                  faraid: parsedInputs.faraid
                } : {}),
                ...(hasSport === true ? { sport: parsedInputs.sport } : {}),
                coefSum: regionalCoefSum
              })
              : branch1 === "applied_arts"
              ? t('calculationDetails.independentAppliedArtsRegional', {
                math: parsedInputs.math,
                fr: parsedInputs.fr,
                isl: parsedInputs.islamic,
                ar: parsedInputs.ar,
                ...(hasITGeo === true ? { itGeo: parsedInputs.it_geo } : {}),
                ...(hasVisualArts === true ? { visualArts: parsedInputs.visual_arts } : {}),
                ...(hasSport === true ? { sport: parsedInputs.sport } : {}),
                coefSum: regionalCoefSum
              })
              : branch1 === "science"
              ? t('calculationDetails.independentScienceRegional', {
                fr: parsedInputs.fr,
                hg: parsedInputs.hg,
                isl: parsedInputs.islamic,
                ar: parsedInputs.ar,
                ...(hasSport === true ? { sport: parsedInputs.sport } : {}),
                ...(hasTranslation === true ? { trans: parsedInputs.translation } : {}),
                coefSum: regionalCoefSum
              })
              : branch1 === "adab"
                ? t('calculationDetails.independentAdabRegional', {
                  fr: parsedInputs.fr,
                  isl: parsedInputs.islamic,
                  math: parsedInputs.math,
                  ...(hasSport === true ? { sport: parsedInputs.sport } : {}),
                  ...(hasTranslation === true ? { trans: parsedInputs.translation } : {}),
                  coefSum: regionalCoefSum
                })
                : branch1 === "economics"
                  ? t('calculationDetails.independentEconomicsRegional', {
                    ar: parsedInputs.ar,
                    fr: parsedInputs.fr,
                    isl: parsedInputs.islamic,
                    hg: parsedInputs.hg,
                    ...(hasMIS === true ? { mis: parsedInputs.mis } : {}),
                    ...(hasLaw === true ? { law: parsedInputs.law } : {}),
                    ...(hasSport === true ? { sport: parsedInputs.sport } : {}),
                    coefSum: regionalCoefSum
                  })
                  : branch1 === "math"
                    ? t('calculationDetails.independentMathRegional', {
                      ar: parsedInputs.ar,
                      fr: parsedInputs.fr,
                      isl: parsedInputs.islamic,
                      hg: parsedInputs.hg,
                      ...(hasTranslation === true ? { trans: parsedInputs.translation } : {}),
                      ...(hasSport === true ? { sport: parsedInputs.sport } : {}),
                      coefSum: regionalCoefSum
                    })
                    : t('calculationDetails.independentScienceTechRegional', {
                      ar: parsedInputs.ar,
                      fr: parsedInputs.fr,
                      isl: parsedInputs.islamic,
                      ...(hasTranslation === true ? { trans: parsedInputs.translation } : {}),
                      ...(hasSport === true ? { sport: parsedInputs.sport } : {}),
                      coefSum: regionalCoefSum
                    })
          },
          {
            title: t('calculationSteps.independentNational'),
            value: nationalAvg.toFixed(2),
            details: branch1 === "traditional" && branch2 === "arabic_language"
              ? t('calculationDetails.independentArabicNational', {
                ling: parsedInputs.linguistics,
                lit: parsedInputs.literature,
                interp: parsedInputs.interpretation,
                en: parsedInputs.en,
                philo: parsedInputs.philo,
                coefSum: nationalCoefSum
              })
              : branch1 === "traditional" && branch2 === "islamic_studies"
                ? t('calculationDetails.independentIslamicNational', {
                  lit: parsedInputs.literature,
                  interp: parsedInputs.interpretation,
                  fiqh: parsedInputs.fiqh,
                  en: parsedInputs.en,
                  philo: parsedInputs.philo,
                  coefSum: nationalCoefSum
                })
                : branch1 === "applied_arts"
                ? t('calculationDetails.independentAppliedArtsNational', {
                  product: parsedInputs.product_design,
                  multimedia: parsedInputs.multimedia_design,
                  env: parsedInputs.env_design,
                  en: parsedInputs.en,
                  philo: parsedInputs.philo,
                  coefSum: nationalCoefSum
                })
                : branch1 === "science"
                ? branch2 === "agricultural"
                  ? t('calculationDetails.independentAgriculturalNational', {
                    math: parsedInputs.math,
                    pc: parsedInputs.pc,
                    svt: parsedInputs.svt,
                    plantAnimal: parsedInputs.plant_animal,
                    philo: parsedInputs.philo,
                    en: parsedInputs.en,
                    coefSum: nationalCoefSum
                  })
                  : t(`calculationDetails.independent${branch2 === "svt" ? "SVT" : "PC"}National`, {
                    svt: parsedInputs.svt,
                    svtCoef: branch2 === "svt" ? 7 : 5,
                    math: parsedInputs.math,
                    pc: parsedInputs.pc,
                    pcCoef: branch2 === "pc" ? 7 : 5,
                    philo: parsedInputs.philo,
                    en: parsedInputs.en,
                    coefSum: nationalCoefSum
                  })
                : branch1 === "adab"
                  ? t('calculationDetails.independentAdabNational', {
                    ar: parsedInputs.ar,
                    arCoef: branch2 === "lettres" ? 4 : 3,
                    en: parsedInputs.en,
                    enCoef: branch2 === "lettres" ? 4 : 3,
                    hg: parsedInputs.hg,
                    hgCoef: branch2 === "lettres" ? 3 : 4,
                    philo: parsedInputs.philo,
                    philoCoef: branch2 === "lettres" ? 3 : 4,
                    coefSum: nationalCoefSum
                  })
                  : branch1 === "economics"
                    ? t('calculationDetails.independentEconomicsNational', {
                      math: parsedInputs.math,
                      account: parsedInputs.accounting,
                      accountCoef: branch2 === "accounting" ? 6 : 4,
                      genEcon: parsedInputs.general_economics,
                      genEconCoef: branch2 === "accounting" ? 3 : 6,
                      econ: parsedInputs.economics,
                      econCoef: branch2 === "accounting" ? 6 : 3,
                      philo: parsedInputs.philo,
                      en: parsedInputs.en,
                      coefSum: nationalCoefSum
                    })
                    : branch1 === "math"
                      ? t('calculationDetails.independentMathNational', {
                        math: parsedInputs.math,
                        pc: parsedInputs.pc,
                        ...(branch2 === "math_a" ? {
                          svt: parsedInputs.svt
                        } : {
                          eng: parsedInputs.engineering
                        }),
                        philo: parsedInputs.philo,
                        en: parsedInputs.en,
                        coefSum: nationalCoefSum
                      })
                      : t('calculationDetails.independentScienceTechNational', {
                        math: parsedInputs.math,
                        pc: parsedInputs.pc,
                        eng: parsedInputs.engineering,
                        philo: parsedInputs.philo,
                        en: parsedInputs.en,
                        coefSum: nationalCoefSum
                      })
          },
          {
            title: t('calculationSteps.independentFinal'),
            value: finalAvg.toFixed(2),
            details: t('calculationDetails.independentFinal', {
              regional: regionalAvg.toFixed(2),
              national: nationalAvg.toFixed(2)
            })
          }
        ]);
      }

      setFinalAverage(finalAverage.toFixed(2));
      setAdmitted(finalAverage >= 10);
      setShowResults(true);
    } catch (error) {
      console.error("Calculation error:", error);
      alert(t('alerts.calculationError'));
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
          placeholder={t('inputPlaceholder', { subject: label })}
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
        <h3>{t('breakdown.title')}</h3>
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
          {t('close')}
        </button>
      </div>
    </div>
  );

  if (showResults) {
    return (
      <div className="stream-view">
        <div className="results-screen">
          <h2>{t('results.title')}</h2>
          <div className="final-score">
            {finalAverage} <span className="score-max">/20</span>
          </div>

          <div className="exam-components">
            {studentType === "regular" && (
              <div className="exam-component">
                <span className="component-label">{t('results.continuousControl')}:</span>
                <span className="component-value">{continuousControlNote}/20</span>
              </div>
            )}
            <div className="exam-component">
              <span className="component-label">{t('results.regionalExam')}:</span>
              <span className="component-value">{regionalExamNote}/20</span>
            </div>
            <div className="exam-component">
              <span className="component-label">{t('results.nationalExam')}:</span>
              <span className="component-value">{nationalExamNote}/20</span>
            </div>
          </div>

          <p className={`result-message ${admitted ? "success" : "error"}`}>
            {admitted ? t('results.congratulations') : t('results.notAdmitted')}
          </p>
          
          <div className="results-actions">
            <button 
              className="btn breakdown-btn"
              onClick={() => setShowBreakdown(true)}
            >
              {t('results.showBreakdown')}
            </button>
            
            <button 
              className="btn back-btn"
              onClick={handleBackFromResults}
            >
              {t('results.backToCalculation')}
            </button>
            
            <button 
              className="reset-btn"
              onClick={handleReset}
            >
              {t('results.newCalculation')}
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
        ← {t('backToMenu')}
      </button>
      
      <Breadcrumbs 
        steps={breadcrumbSteps} 
        currentStep={step} 
        selectedValues={{
          studentType: studentType === "regular" ? t('studentTypes.regular') : t('studentTypes.independent'),
          branch1: branch1 === "science" ? t('branches.science') : 
                  branch1 === "adab" ? t('branches.adab') : 
                  branch1 === "economics" ? t('branches.economics') :
                  branch1 === "math" ? t('branches.math') :
                  branch1 === "science_tech" ? t('branches.scienceTech') :
                  branch1 === "traditional" ? t('branches.traditional') :
                  branch1 === "applied_arts" ? t('branches.appliedArts') : "",
          branch2: branch2 === "svt" ? t('tracks.svt') : 
                  branch2 === "pc" ? t('tracks.pc') : 
                  branch2 === "agricultural" ? t('tracks.agricultural') :
                  branch2 === "lettres" ? t('tracks.lettres') : 
                  branch2 === "science humain" ? t('tracks.scienceHumain') :
                  branch2 === "accounting" ? t('tracks.accounting') :
                  branch2 === "economic_sciences" ? t('tracks.economicSciences') :
                  branch2 === "math_a" ? t('tracks.mathA') :
                  branch2 === "math_b" ? t('tracks.mathB') :
                  branch2 === "mechanical_tech" ? t('tracks.mechanicalTech') :
                  branch2 === "electrical_tech" ? t('tracks.electricalTech') :
                  branch2 === "arabic_language" ? t('tracks.arabicLanguage') :
                  branch2 === "islamic_studies" ? t('tracks.islamicStudies') :
                  branch2 === "applied_arts_track" ? t('tracks.appliedArts') : ""
        }}
        branch1={branch1}
      />

      <div className="progress-bar">
        {[...Array(
          studentType === 'regular' 
            ? (branch1 === 'traditional' || branch1 === 'applied_arts' ? 6 : (branch1 === 'math' || branch1 === 'science_tech' ? 5 : 6)) 
            : (branch1 === 'traditional' || branch1 === 'applied_arts' ? 5 : (branch1 === 'math' || branch1 === 'science_tech' ? 4 : 5))
        )].map((_, i) => (
          <div 
            key={i} 
            className={`step-dot ${i <= step ? 'active' : ''}`}
            onClick={() => i <= step && setStep(i)}
          />
        ))}
      </div>
      
      <h1>{t('title')}</h1>

      {step === 0 && (
        <div className="step-content">
          <p>{t('selectStudentType')}</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setStudentType("regular"); 
              setSelectedValues(prev => ({ ...prev, studentType: t('studentTypes.regular') }));
              handleNext(); 
            }}>
              {t('studentTypes.regular')}
            </button>
            <button className="btn" onClick={() => { 
              setStudentType("independent"); 
              setSelectedValues(prev => ({ ...prev, studentType: t('studentTypes.independent') }));
              handleNext(); 
            }}>
              {t('studentTypes.independent')}
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="step-content">
          <p>{t('selectBranch')}</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setBranch1("science"); 
              setSelectedValues(prev => ({ ...prev, branch1: t('branches.science') }));
              handleNext(); 
            }}>
              {t('branches.science')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch1("adab"); 
              setSelectedValues(prev => ({ ...prev, branch1: t('branches.adab') }));
              handleNext(); 
            }}>
              {t('branches.adab')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch1("economics"); 
              setSelectedValues(prev => ({ ...prev, branch1: t('branches.economics') }));
              handleNext(); 
            }}>
              {t('branches.economics')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch1("math"); 
              setSelectedValues(prev => ({ ...prev, branch1: t('branches.math') }));
              handleNext(); 
            }}>
              {t('branches.math')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch1("science_tech"); 
              setSelectedValues(prev => ({ ...prev, branch1: t('branches.scienceTech') }));
              handleNext(); 
            }}>
              {t('branches.scienceTech')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch1("traditional"); 
              setSelectedValues(prev => ({ ...prev, branch1: t('branches.traditional') }));
              handleNext(); 
            }}>
              {t('branches.traditional')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch1("applied_arts"); 
              setSelectedValues(prev => ({ ...prev, branch1: t('branches.appliedArts') }));
              handleNext(); 
            }}>
              {t('branches.appliedArts')}
            </button>
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
          </div>
        </div>
      )}

      {step === 2 && branch1 === "traditional" && (
        <div className="step-content">
          <p>{t('selectTraditionalTrack')}</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setBranch2("arabic_language"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.arabicLanguage') }));
              handleNext(); 
            }}>
              {t('tracks.arabicLanguage')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch2("islamic_studies"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.islamicStudies') }));
              handleNext(); 
            }}>
              {t('tracks.islamicStudies')}
            </button>
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && branch1 === "applied_arts" && (
        <div className="step-content">
          <h2 className="exam-title">{t('regionalExam')}</h2>
          {renderInput("math", t('subjects.math'))}
          {renderInput("fr", t('subjects.french'))}
          {renderInput("islamic", t('subjects.islamic'))}
          {renderInput("ar", t('subjects.arabic'))}

          {/* IT & Geography Question */}
          {hasITGeo === null && (
            <div className="question-box it-geo-question">
              <p>{t('questions.itGeo')}</p>
              <div className="it-geo-buttons">
                <button className="btn btn-yes" onClick={() => setHasITGeo(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasITGeo(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show IT & Geography input if answered Yes */}
          {hasITGeo === true && renderInput("it_geo", t('subjects.itGeo'))}

          {/* Change IT & Geography answer button */}
          {hasITGeo !== null && (
            <button 
              className="btn btn-change-answer" 
              onClick={() => {
                setHasITGeo(null);
                setInputs(prev => {
                  const newInputs = {...prev};
                  delete newInputs.it_geo;
                  return newInputs;
                });
              }}
            >
              {t('changeAnswer')}
            </button>
          )}

          {/* Visual Arts Question */}
          {hasVisualArts === null && (
            <div className="question-box visual-arts-question">
              <p>{t('questions.visualArts')}</p>
              <div className="visual-arts-buttons">
                <button className="btn btn-yes" onClick={() => setHasVisualArts(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasVisualArts(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show Visual Arts input if answered Yes */}
          {hasVisualArts === true && renderInput("visual_arts", t('subjects.visualArts'))}

          {/* Change Visual Arts answer button */}
          {hasVisualArts !== null && (
            <button 
              className="btn btn-change-answer" 
              onClick={() => {
                setHasVisualArts(null);
                setInputs(prev => {
                  const newInputs = {...prev};
                  delete newInputs.visual_arts;
                  return newInputs;
                });
              }}
            >
              {t('changeAnswer')}
            </button>
          )}

          {/* Physical Education Question (only for independent candidates) */}
          {studentType === "independent" && hasSport === null && (
            <div className="question-box sport-question">
              <p>{t('questions.sport')}</p>
              <div className="sport-buttons">
                <button className="btn btn-yes" onClick={() => setHasSport(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasSport(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show Physical Education input if answered Yes */}
          {studentType === "independent" && hasSport === true && renderInput("sport", t('subjects.sport'))}

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
              {t('changeAnswer')}
            </button>
          )}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            <button className="btn" onClick={handleNext}>
              {t('next')}
            </button>
          </div>
        </div>
      )}

      {step === 2 && branch1 === "science" && (
        <div className="step-content">
          <h2 className="exam-title">{t('regionalExam')}</h2>
          {renderInput("fr", t('subjects.french'))}
          {renderInput("hg", t('subjects.historyGeography'))}
          {renderInput("islamic", t('subjects.islamic'))}
          {renderInput("ar", t('subjects.arabic'))}

          {/* Translation Question */}
          {hasTranslation === null && (
            <div className="question-box translation-question">
              <p>{t('questions.translation')}</p>
              <div className="translation-buttons">
                <button className="btn btn-yes" onClick={() => setHasTranslation(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasTranslation(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show Translation input if answered Yes */}
          {hasTranslation === true && renderInput("translation", t('subjects.translation'))}

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
              {t('changeAnswer')}
            </button>
          )}

          {/* Physical Education Question (only for independent candidates) */}
          {studentType === "independent" && hasSport === null && (
            <div className="question-box sport-question">
              <p>{t('questions.sport')}</p>
              <div className="sport-buttons">
                <button className="btn btn-yes" onClick={() => setHasSport(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasSport(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show Physical Education input if answered Yes */}
          {studentType === "independent" && hasSport === true && renderInput("sport", t('subjects.sport'))}

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
              {t('changeAnswer')}
            </button>
          )}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            <button className="btn" onClick={handleNext}>
              {t('next')}
            </button>
          </div>
        </div>
      )}

      {step === 2 && branch1 === "adab" && (
        <div className="step-content">
          <h2 className="exam-title">{t('regionalExam')}</h2>
          {renderInput("fr", t('subjects.french'))}
          {renderInput("islamic", t('subjects.islamic'))}
          {renderInput("math", t('subjects.math'))}

          {/* Translation Question */}
          {hasTranslation === null && (
            <div className="question-box translation-question">
              <p>{t('questions.translation')}</p>
              <div className="translation-buttons">
                <button className="btn btn-yes" onClick={() => setHasTranslation(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasTranslation(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show Translation input if answered Yes */}
          {hasTranslation === true && renderInput("translation", t('subjects.translation'))}

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
              {t('changeAnswer')}
            </button>
          )}

          {/* Physical Education Question (only for independent candidates) */}
          {studentType === "independent" && hasSport === null && (
            <div className="question-box sport-question">
              <p>{t('questions.sport')}</p>
              <div className="sport-buttons">
                <button className="btn btn-yes" onClick={() => setHasSport(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasSport(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show Physical Education input if answered Yes */}
          {studentType === "independent" && hasSport === true && renderInput("sport", t('subjects.sport'))}

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
              {t('changeAnswer')}
            </button>
          )}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            <button className="btn" onClick={handleNext}>
              {t('next')}
            </button>
          </div>
        </div>
      )}

      {step === 2 && branch1 === "economics" && (
        <div className="step-content">
          <h2 className="exam-title">{t('regionalExam')}</h2>
          {renderInput("ar", t('subjects.arabic'))}
          {renderInput("fr", t('subjects.french'))}
          {renderInput("islamic", t('subjects.islamic'))}
          {renderInput("hg", t('subjects.historyGeography'))}

          {/* MIS Question */}
          {hasMIS === null && (
            <div className="question-box mis-question">
              <p>{t('questions.mis')}</p>
              <div className="mis-buttons">
                <button className="btn btn-yes" onClick={() => setHasMIS(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasMIS(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show MIS input if answered Yes */}
          {hasMIS === true && renderInput("mis", t('subjects.mis'))}

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
              {t('changeAnswer')}
            </button>
          )}

          {/* Law Question */}
          {hasLaw === null && (
            <div className="question-box law-question">
              <p>{t('questions.law')}</p>
              <div className="law-buttons">
                <button className="btn btn-yes" onClick={() => setHasLaw(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasLaw(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show Law input if answered Yes */}
          {hasLaw === true && renderInput("law", t('subjects.law'))}

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
              {t('changeAnswer')}
            </button>
          )}

          {/* Physical Education Question (only for independent candidates) */}
          {studentType === "independent" && hasSport === null && (
            <div className="question-box sport-question">
              <p>{t('questions.sport')}</p>
              <div className="sport-buttons">
                <button className="btn btn-yes" onClick={() => setHasSport(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasSport(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show Physical Education input if answered Yes */}
          {studentType === "independent" && hasSport === true && renderInput("sport", t('subjects.sport'))}

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
              {t('changeAnswer')}
            </button>
          )}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            <button className="btn" onClick={handleNext}>
              {t('next')}
            </button>
          </div>
        </div>
      )}

      {step === 2 && branch1 === "math" && (
        <div className="step-content">
          <h2 className="exam-title">{t('regionalExam')}</h2>
          {renderInput("ar", t('subjects.arabic'))}
          {renderInput("fr", t('subjects.french'))}
          {renderInput("islamic", t('subjects.islamic'))}
          {renderInput("hg", t('subjects.historyGeography'))}

          {/* Translation Question */}
          {hasTranslation === null && (
            <div className="question-box translation-question">
              <p>{t('questions.translation')}</p>
              <div className="translation-buttons">
                <button className="btn btn-yes" onClick={() => setHasTranslation(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasTranslation(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show Translation input if answered Yes */}
          {hasTranslation === true && renderInput("translation", t('subjects.translation'))}

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
              {t('changeAnswer')}
            </button>
          )}

          {/* Physical Education Question (only for independent candidates) */}
          {studentType === "independent" && hasSport === null && (
            <div className="question-box sport-question">
              <p>{t('questions.sport')}</p>
              <div className="sport-buttons">
                <button className="btn btn-yes" onClick={() => setHasSport(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasSport(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show Physical Education input if answered Yes */}
          {studentType === "independent" && hasSport === true && renderInput("sport", t('subjects.sport'))}

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
              {t('changeAnswer')}
            </button>
          )}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            <button className="btn" onClick={handleNext}>
              {t('next')}
            </button>
          </div>
        </div>
      )}

      {step === 2 && branch1 === "science_tech" && (
        <div className="step-content">
          <h2 className="exam-title">{t('regionalExam')}</h2>
          {renderInput("ar", t('subjects.arabic'))}
          {renderInput("fr", t('subjects.french'))}
          {renderInput("islamic", t('subjects.islamic'))}

          {/* Translation Question */}
          {hasTranslation === null && (
            <div className="question-box translation-question">
              <p>{t('questions.translation')}</p>
              <div className="translation-buttons">
                <button className="btn btn-yes" onClick={() => setHasTranslation(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasTranslation(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show Translation input if answered Yes */}
          {hasTranslation === true && renderInput("translation", t('subjects.translation'))}

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
              {t('changeAnswer')}
            </button>
          )}

          {/* Physical Education Question (only for independent candidates) */}
          {studentType === "independent" && hasSport === null && (
            <div className="question-box sport-question">
              <p>{t('questions.sport')}</p>
              <div className="sport-buttons">
                <button className="btn btn-yes" onClick={() => setHasSport(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasSport(false)}>{t('no')}</button>
              </div>
            </div>
          )}

          {/* Show Physical Education input if answered Yes */}
          {studentType === "independent" && hasSport === true && renderInput("sport", t('subjects.sport'))}

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
              {t('changeAnswer')}
            </button>
          )}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            <button className="btn" onClick={handleNext}>
              {t('next')}
            </button>
          </div>
        </div>
      )}

      {step === 3 && branch1 === "traditional" && branch2 === "arabic_language" && (
        <div className="step-content">
          <h2 className="exam-title">{t('regionalExam')}</h2>
          {renderInput("fr", t('subjects.french'))}
          {renderInput("hg", t('subjects.historyGeography'))}
          {renderInput("math", t('subjects.math'))}
          {renderInput("documentation", t('subjects.documentation'))}

          {/* Physical Education Question */}
          {studentType === "independent" && hasSport === null && (
            <div className="question-box sport-question">
              <p>{t('questions.sport')}</p>
              <div className="sport-buttons">
                <button className="btn btn-yes" onClick={() => setHasSport(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasSport(false)}>{t('no')}</button>
              </div>
            </div>
          )}
          {studentType === "independent" && hasSport === true && renderInput("sport", t('subjects.sport'))}
          {studentType === "independent" && hasSport !== null && (
            <button className="btn btn-change-answer" onClick={() => setHasSport(null)}>
              {t('changeAnswer')}
            </button>
          )}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>{t('back')}</button>
            <button className="btn" onClick={handleNext}>{t('next')}</button>
          </div>
        </div>
      )}

      {step === 3 && branch1 === "traditional" && branch2 === "islamic_studies" && (
        <div className="step-content">
          <h2 className="exam-title">{t('regionalExam')}</h2>
          {renderInput("fr", t('subjects.french'))}
          {renderInput("hg", t('subjects.historyGeography'))}
          {renderInput("math", t('subjects.math'))}
          {renderInput("documentation", t('subjects.documentation'))}
          {renderInput("linguistics", t('subjects.linguistics'))}
          {renderInput("faraid", t('subjects.faraid'))}

          {/* Physical Education Question */}
          {studentType === "independent" && hasSport === null && (
            <div className="question-box sport-question">
              <p>{t('questions.sport')}</p>
              <div className="sport-buttons">
                <button className="btn btn-yes" onClick={() => setHasSport(true)}>{t('yes')}</button>
                <button className="btn btn-no" onClick={() => setHasSport(false)}>{t('no')}</button>
              </div>
            </div>
          )}
          {studentType === "independent" && hasSport === true && renderInput("sport", t('subjects.sport'))}
          {studentType === "independent" && hasSport !== null && (
            <button className="btn btn-change-answer" onClick={() => setHasSport(null)}>
              {t('changeAnswer')}
            </button>
          )}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>{t('back')}</button>
            <button className="btn" onClick={handleNext}>{t('next')}</button>
          </div>
        </div>
      )}
      
      {step === 3 && branch1 === "science" && (
        <div className="step-content">
          <p>{t('selectScienceStream')}</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setBranch2("svt"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.svt') }));
              handleNext(); 
            }}>
              {t('tracks.svt')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch2("pc"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.pc') }));
              handleNext(); 
            }}>
              {t('tracks.pc')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch2("agricultural"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.agricultural') }));
              handleNext(); 
            }}>
              {t('tracks.agricultural')}
            </button>
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
          </div>
        </div>
      )}

      {step === 3 && branch1 === "adab" && (
        <div className="step-content">
          <p>{t('selectLiteratureStream')}</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setBranch2("lettres"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.lettres') }));
              handleNext(); 
            }}>
              {t('tracks.lettres')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch2("science humain"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.scienceHumain') }));
              handleNext(); 
            }}>
              {t('tracks.scienceHumain')}
            </button>
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
          </div>
        </div>
      )}

      {step === 3 && branch1 === "economics" && (
        <div className="step-content">
          <p>{t('selectEconomicsStream')}</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setBranch2("accounting"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.accounting') }));
              handleNext(); 
            }}>
              {t('tracks.accounting')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch2("economic_sciences"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.economicSciences') }));
              handleNext(); 
            }}>
              {t('tracks.economicSciences')}
            </button>
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
          </div>
        </div>
      )}

      {step === 3 && branch1 === "math" && (
        <div className="step-content">
          <p>{t('selectMathStream')}</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setBranch2("math_a"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.mathA') }));
              handleNext(); 
            }}>
              {t('tracks.mathA')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch2("math_b"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.mathB') }));
              handleNext(); 
            }}>
              {t('tracks.mathB')}
            </button>
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
          </div>
        </div>
      )}

      {step === 3 && branch1 === "science_tech" && (
        <div className="step-content">
          <p>{t('selectScienceTechStream')}</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setBranch2("mechanical_tech"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.mechanicalTech') }));
              handleNext(); 
            }}>
              {t('tracks.mechanicalTech')}
            </button>
            <button className="btn" onClick={() => { 
              setBranch2("electrical_tech"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.electricalTech') }));
              handleNext(); 
            }}>
              {t('tracks.electricalTech')}
            </button>
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
          </div>
        </div>
      )}

      {step === 3 && branch1 === "applied_arts" && (
        <div className="step-content">
          <p>{t('selectAppliedArtsTrack')}</p>
          <div className="button-group">
            <button className="btn" onClick={() => { 
              setBranch2("applied_arts_track"); 
              setSelectedValues(prev => ({ ...prev, branch2: t('tracks.appliedArts') }));
              handleNext(); 
            }}>
              {t('tracks.appliedArts')}
            </button>
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
          </div>
        </div>
      )}

      {step === 4 && branch1 === "traditional" && branch2 === "arabic_language" && (
        <div className="step-content">
          <h2 className="exam-title">{t('nationalExam')}</h2>
          {renderInput("linguistics", t('subjects.linguistics'))}
          {renderInput("literature", t('subjects.literature'))}
          {renderInput("interpretation", t('subjects.interpretation'))}
          {renderInput("en", t('subjects.english'))}
          {renderInput("philo", t('subjects.philosophy'))}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>{t('back')}</button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>{t('calculateAverage')}</button>
            ) : (
              <button className="btn" onClick={handleNext}>{t('next')}</button>
            )}
          </div>
        </div>
      )}

      {step === 4 && branch1 === "traditional" && branch2 === "islamic_studies" && (
        <div className="step-content">
          <h2 className="exam-title">{t('nationalExam')}</h2>
          {renderInput("literature", t('subjects.literature'))}
          {renderInput("interpretation", t('subjects.interpretation'))}
          {renderInput("fiqh", t('subjects.fiqh'))}
          {renderInput("en", t('subjects.english'))}
          {renderInput("philo", t('subjects.philosophy'))}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>{t('back')}</button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>{t('calculateAverage')}</button>
            ) : (
              <button className="btn" onClick={handleNext}>{t('next')}</button>
            )}
          </div>
        </div>
      )}

      {step === 4 && branch1 === "applied_arts" && branch2 === "applied_arts_track" && (
        <div className="step-content">
          <h2 className="exam-title">{t('nationalExam')}</h2>
          {renderInput("product_design", t('subjects.productDesign'))}
          {renderInput("multimedia_design", t('subjects.multimediaDesign'))}
          {renderInput("env_design", t('subjects.envDesign'))}
          {renderInput("en", t('subjects.english'))}
          {renderInput("philo", t('subjects.philosophy'))}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>{t('back')}</button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>{t('calculateAverage')}</button>
            ) : (
              <button className="btn" onClick={handleNext}>{t('next')}</button>
            )}
          </div>
        </div>
      )}

      {step === 4 && branch1 === "science" && branch2 === "svt" && (
        <div className="step-content">
          <h2 className="exam-title">{t('nationalExam')}</h2>
          {renderInput("svt", t('subjects.svt'))}
          {renderInput("math", t('subjects.math'))}
          {renderInput("pc", t('subjects.physicsChemistry'))}
          {renderInput("philo", t('subjects.philosophy'))}
          {renderInput("en", t('subjects.english'))}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>
                {t('calculateAverage')}
              </button>
            ) : (
              <button className="btn" onClick={handleNext}>
                {t('next')}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 4 && branch1 === "science" && branch2 === "pc" && (
        <div className="step-content">
          <h2 className="exam-title">{t('nationalExam')}</h2>
          {renderInput("svt", t('subjects.svt'))}
          {renderInput("math", t('subjects.math'))}
          {renderInput("pc", t('subjects.physicsChemistry'))}
          {renderInput("philo", t('subjects.philosophy'))}
          {renderInput("en", t('subjects.english'))}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>
                {t('calculateAverage')}
              </button>
            ) : (
              <button className="btn" onClick={handleNext}>
                {t('next')}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 4 && branch1 === "science" && branch2 === "agricultural" && (
        <div className="step-content">
          <h2 className="exam-title">{t('nationalExam')}</h2>
          {renderInput("math", t('subjects.math'))}
          {renderInput("pc", t('subjects.physicsChemistry'))}
          {renderInput("plant_animal", t('subjects.plantAnimal'))}
          {renderInput("philo", t('subjects.philosophy'))}
          {renderInput("en", t('subjects.english'))}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>
                {t('calculateAverage')}
              </button>
            ) : (
              <button className="btn" onClick={handleNext}>
                {t('next')}
              </button>
            )}
          </div>
        </div>
      )}
      
      {step === 4 && branch1 === "adab" && (
        <div className="step-content">
          <h2 className="exam-title">{t('nationalExam')}</h2>
          {renderInput("ar", t('subjects.arabic'))}
          {renderInput("en", t('subjects.english'))}
          {renderInput("hg", t('subjects.historyGeography'))}
          {renderInput("philo", t('subjects.philosophy'))}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>
                {t('calculateAverage')}
              </button>
            ) : (
              <button className="btn" onClick={handleNext}>
                {t('next')}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 4 && branch1 === "economics" && (
        <div className="step-content">
          <h2 className="exam-title">{t('nationalExam')}</h2>
          {renderInput("math", t('subjects.math'))}
          {renderInput("accounting", t('subjects.accounting'))}
          {renderInput("general_economics", t('subjects.generalEconomics'))}
          {renderInput("economics", t('subjects.economics'))}
          {renderInput("philo", t('subjects.philosophy'))}
          {renderInput("en", t('subjects.english'))}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>
                {t('calculateAverage')}
              </button>
            ) : (
              <button className="btn" onClick={handleNext}>
                {t('next')}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 4 && branch1 === "math" && (
        <div className="step-content">
          <h2 className="exam-title">{t('nationalExam')}</h2>
          {renderInput("math", t('subjects.math'))}
          {renderInput("pc", t('subjects.physicsChemistry'))}
          {branch2 === "math_a" && renderInput("svt", t('subjects.svt'))}
          {branch2 === "math_b" && renderInput("engineering", t('subjects.engineering'))}
          {renderInput("philo", t('subjects.philosophy'))}
          {renderInput("en", t('subjects.english'))}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>
                {t('calculateAverage')}
              </button>
            ) : (
              <button className="btn" onClick={handleNext}>
                {t('next')}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 4 && branch1 === "science_tech" && (
        <div className="step-content">
          <h2 className="exam-title">{t('nationalExam')}</h2>
          {renderInput("math", t('subjects.math'))}
          {renderInput("pc", t('subjects.physicsChemistry'))}
          {renderInput("engineering", t('subjects.engineering'))}
          {renderInput("philo", t('subjects.philosophy'))}
          {renderInput("en", t('subjects.english'))}

          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            {studentType === "independent" ? (
              <button className="btn" onClick={calcAverage}>
                {t('calculateAverage')}
              </button>
            ) : (
              <button className="btn" onClick={handleNext}>
                {t('next')}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 5 && studentType === "regular" && (
        <div className="step-content">
          <h2 className="exam-title">{t('continuousControls')}</h2>
          {renderInput("s1", t('semester1'))}
          {renderInput("s2", t('semester2'))}
          <div className="navigation-buttons">
            <button className="btn back" onClick={handleBack}>
              {t('back')}
            </button>
            <button className="btn" onClick={calcAverage}>
              {t('calculateAverage')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('menu');

  const changeLanguage = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

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
      case 'support':
        return <SupportPage onBack={() => setCurrentView('menu')} />;
      default:
        return (
          <>
            <MainMenu onSelectCalculator={(type) => setCurrentView(type)} />
            
          </>
        );
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
        <div className="language-switcher">
          <select
            value={i18n.language}
            onChange={changeLanguage}
            className="language-select"
          >
            <option value="en">🇬🇧 English</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="ar">🇲🇦 العربية</option>
          </select>
        </div>
      </div>
      <button 
        className="donate-button"
        onClick={() => setCurrentView('support')}
      >
        {t('donate')}
      </button>
      {renderCurrentView()}

      <footer className="copyright">
        <p>{t('footer.copyright')}</p>
        <div className="version-info">
          <span>{t('footer.version', { version: APP_VERSION.version })}</span>
          <span>•</span>
          <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">
            {t('footer.license')}
          </a>
          <span>•</span>
          <span>{t('footer.lastUpdated', { date: APP_VERSION.lastUpdated })}</span>
        </div>
      </footer>
    </div>
  );
}