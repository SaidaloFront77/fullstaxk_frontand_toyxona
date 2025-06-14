import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // ✅ i18n qo‘shildi
import './EditToyxona.css';

const EditToyxona = () => {
  const { t } = useTranslation(); // ✅
  const [toyxona, setToyxona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToyxona = async () => {
      try {
        const res = await axios.get('/owner/my-toyxona', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setToyxona(res.data.toyxona);
      } catch (err) {
        setError(t('error_fetch')); // ✅
      } finally {
        setLoading(false);
      }
    };

    fetchToyxona();
  }, [t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setToyxona(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.put('/owner/my-updatetoyxona', toyxona, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess(t('success_save')); // ✅
      setTimeout(() => navigate('/owner/my-toyxona'), 1500);
    } catch {
      setError(t('error_save')); // ✅
    }
  };

  if (loading) return <p className="loading-text">{t('loading')}</p>; // ✅
  if (!toyxona) return <p className="error-text">{t('not_found')}</p>; // ✅

  return (
    <div className="edit-toyxona-wrapper">
      <div className="edit-toyxona-container">
        <h1 className="edit-toyxona-title">{t('Title')}</h1> {/* ✅ */}

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <form onSubmit={handleSubmit} className="edit-toyxona-form">
          <input
            type="text"
            name="name"
            placeholder={t('name')} // ✅
            value={toyxona.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder={t('address')} // ✅
            value={toyxona.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="rayon"
            placeholder={t('rayon')} // ✅
            value={toyxona.rayon}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="orindiq_soni"
            placeholder={t('capacity')} // ✅
            value={toyxona.orindiq_soni}
            onChange={handleChange}
            required
            min="1"
          />
          <input
            type="number"
            name="orindiq_narxi"
            placeholder={t('price')} // ✅
            value={toyxona.orindiq_narxi}
            onChange={handleChange}
            required
            min="0"
          />
          <input
            type="text"
            name="phone"
            placeholder={t('phone')} // ✅
            value={toyxona.phone}
            onChange={handleChange}
            required
          />
          <button type="submit" className="edit-toyxona-submit">{t('save')}</button> {/* ✅ */}
        </form>
      </div>
    </div>
  );
};

export default EditToyxona;
