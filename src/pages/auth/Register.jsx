import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './Register.css';
import { useTranslation } from 'react-i18next'; // ✅

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // ✅

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/auth/register', {...form, role: 'user'});
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || t('register_error_default'));
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">{t('register_title')}</h2>
      {error && <p className="register-error">{error}</p>}
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstname"
          placeholder={t('firstname_placeholder')}
          className="register-input"
          value={form.firstname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastname"
          placeholder={t('lastname_placeholder')}
          className="register-input"
          value={form.lastname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder={t('username_placeholder')}
          className="register-input"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={t('password_placeholder')}
          className="register-input"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="register-button">
          {t('register_button')}
        </button>
      </form>
    </div>
  );
};

export default Register;
