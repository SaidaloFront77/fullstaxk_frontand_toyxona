import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css'

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select className="language-selector" value={i18n.language} onChange={changeLanguage}>
      <option value="uz">🇺🇿 O`zbekcha</option>
      <option value="en">🇬🇧 English</option>
      <option value="ru">🇷🇺 Русский</option>
      <option value="zh">🇨🇳 中文</option>
      <option value="ja">🇯🇵 日本語</option>
    </select>
  );
};

export default LanguageSelector;
