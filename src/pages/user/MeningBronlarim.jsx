import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './MeningBronlarim.css';
import { useTranslation } from 'react-i18next'; // ✅

const MeningBronlarim = () => {
  const [bronlar, setBronlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation(); // ✅

  const fetchBronlar = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/bron/my');
      setBronlar(res.data);
      setError(null);
    } catch {
      setError(t('error_fetch'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirm_cancel'))) return;
    try {
      await axios.delete(`/bron/${id}`);
      fetchBronlar();
    } catch {
      alert(t('error_cancel'));
    }
  };

  useEffect(() => {
    fetchBronlar();
  }, []);

  if (loading) return <p className="loading-text">{t('loading')}</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="bronlar-container">
      <h1 className="bronlar-title">{t('title')}</h1>
      <table className="bronlar-table">
        <thead>
          <tr>
            <th>{t('th_id')}</th>
            <th>{t('th_toyxona')}</th>
            <th>{t('th_date')}</th>
            <th>{t('th_count')}</th>
            <th>{t('th_status')}</th>
            <th>{t('th_action')}</th>
          </tr>
        </thead>
        <tbody>
          {bronlar.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-bron-text">{t('no_bron')}</td>
            </tr>
          ) : (
            bronlar.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.toyxona_nomi}</td>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>{b.count_people}</td>
                <td className={`status-cell status-${b.status.toLowerCase()}`}>
                  {b.status}
                </td>
                <td>
                  <button className="cancel-button" onClick={() => handleDelete(b.id)}>
                    {t('cancel_button')}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MeningBronlarim;
