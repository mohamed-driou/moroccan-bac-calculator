import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"; // RTL for Arabic
  };

  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("fr")}>Français</button>
      <button onClick={() => changeLanguage("ar")}>العربية</button>
    </div>
  );
};

export default LanguageSwitcher;