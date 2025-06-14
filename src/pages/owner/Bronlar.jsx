import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './Bronlar.css';
import { useTranslation } from 'react-i18next'; // ✅

const OwnerBronlar = () => {
  const { t } = useTranslation(); // ✅
  const [bronlar, setBronlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm(t('confirm_cancel'))) {
      try {
        await axios.delete(`/owner/bronlar/${id}`);
        alert(t('success_cancel'));
        fetchBronlar();
      } catch (err) {
        alert(t('error_cancel'));
      }
    }
  };

  const fetchBronlar = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/owner/bronlar');
      setBronlar(res.data);
      setError(null);
    } catch (err) {
      setError(t('error_fetches'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBronlar();
  }, []);

  if (loading) return <p className="loading-text">{t('loading')}</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="owner-bronlar-container">
      <h1 className="owner-bronlar-title">{t('titlees')}</h1>
      <table className="owner-bronlar-table">
        <thead>
          <tr>
            <th>{t('th_id')}</th>
            <th>{t('th_toyxona')}</th>
            <th>{t('th_date')}</th>
            <th>{t('th_counts')}</th>
            <th>{t('th_user')}</th>
            <th>{t('th_status')}</th>
            <th>{t('th_action')}</th>
          </tr>
        </thead>
        <tbody>
          {bronlar.length === 0 ? (
            <tr><td colSpan="7">{t('no_bron')}</td></tr>
          ) : (
            bronlar.map((bron) => (
              <tr key={bron.id}>
                <td>{bron.id}</td>
                <td>{bron.toyxona_nomi}</td>
                <td>{new Date(bron.date).toLocaleDateString()}</td>
                <td>{bron.count_people}</td>
                <td>{bron.firstname} {bron.lastname} ({bron.username})</td>
                <td>{bron.status}</td>
                <td>
                  <button
                    className="owner-bronlar-delete-btn"
                    onClick={() => handleDelete(bron.id)}
                  >
                    {t('delete_button')}
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

export default OwnerBronlar;
