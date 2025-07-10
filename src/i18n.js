import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import enTranslations from "./locales/en/translation.json";
import frTranslations from "./locales/fr/translation.json";
import arTranslations from "./locales/ar/translation.json";

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    resources: {
      en: { translation: enTranslations },
      fr: { translation: frTranslations },
      ar: { translation: arTranslations }
    },
    fallbackLng: "en", // Default language
    interpolation: {
      escapeValue: false // React already protects against XSS
    },
    detection: {
      order: ["localStorage", "navigator"], // Check localStorage first
      caches: ["localStorage"] // Cache language in localStorage
    }
  });

export default i18n;