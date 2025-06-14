import React from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken, removeToken, removeUser } from '../auth';
import { useTheme } from '../context/ThemeContext';
import LanguageSelector from './LanguageSelector';

import { useMusic } from '../context/MusicContext';
import { useTranslation } from 'react-i18next'; // ✅ i18n

import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = decodeToken();
  const { darkMode, toggleTheme } = useTheme();
  const { isPlaying, setIsModalOpen } = useMusic();
  const { t } = useTranslation(); // ✅ tarjima funksiyasi

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span className={`equalizer ${isPlaying ? 'playing' : ''}`} onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}>
            <span></span><span></span><span></span>
          </span>
          <span style={{ marginLeft: '10px' }}>{t('toyxona')}</span>
        </div>
        <div className="navbar-actions">
          <LanguageSelector />
        </div>
        <div className="navbar-actions">
          <button className="btn btn-theme" onClick={toggleTheme}>
            {darkMode ? t('light') : t('dark')}
          </button>

          {user ? (
            <div className="user-menu">
              <span className="navbar-role">{user.role}</span>
              <button className="btn btn-logout" onClick={() => { removeToken(); removeUser(); navigate('/'); window.location.reload(); }}>
                <span className="btn-text">{t('logout')}</span>
              </button>
            </div>
          ) : (
            <div className="auth-menu">
              <button className="btn btn-login" onClick={() => navigate('/login')}>
                <span className="btn-text">{t('login')}</span>
              </button>
              <button className="btn btn-register" onClick={() => navigate('/register')}>
                <span className="btn-text">{t('register')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
