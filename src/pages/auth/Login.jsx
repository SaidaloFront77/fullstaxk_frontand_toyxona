import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { saveToken, saveUser } from '../../auth';
import './Login.css';
import { useTranslation } from 'react-i18next'; // ✅

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // ✅

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({ username, password });
      saveToken(response.token);
      saveUser(response.user);

      if (response.user.role === 'admin') navigate('/admin/toyxonalar');
      else if (response.user.role === 'egasi') navigate('/owner/bronlar');
      else navigate('/user/home');
    } catch (err) {
      setError(err.response?.data?.msg || t('login_error_default'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">{t('login_title')}</h2>
      {error && <p className="login-error">{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">{t('username_label')}</label>
          <input
            id="username"
            type="text"
            className="login-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            placeholder={t('username_placeholder')}
            disabled={loading}
            autoComplete="username"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">{t('password_label')}</label>
          <input
            id="password"
            type="password"
            className="login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder={t('password_placeholder')}
            disabled={loading}
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? t('login_button_loading') : t('login_button')}
        </button>
      </form>
    </div>
  );
};

export default Login;
