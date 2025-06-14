import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // ✅
import './OwnerMyToyxona.css';

const OwnerMyToyxonalar = () => {
  const { t } = useTranslation(); // ✅
  const [toyxonalar, setToyxonalar] = useState([]);
  const navigate = useNavigate();

  const fetchToyxonalar = async () => {
    try {
      const res = await axios.get('/owner/my-toyxonalar');
      const data = res.data.toyxonalar;

      if (Array.isArray(data)) {
        setToyxonalar(data);
      } else if (data) {
        setToyxonalar([data]);
      } else {
        setToyxonalar([]);
      }
    } catch (err) {
      alert(t('fetch_error'));
    }
  };

  const handleEdit = (id) => {
    navigate(`/owner/edit-toyxona/${id}`);
  };

  useEffect(() => {
    fetchToyxonalar();
  }, []);

  if (toyxonalar.length === 0) return <p className="loading">{t('loading')}</p>;

  return (
    <div className="toyxonalar-container">
      <h2 className="toyxona-title">{t('my_halls_title')}</h2>
      <div className="toyxona-cards-grid">
        {toyxonalar.map(toyxona => (
          <div key={toyxona.id} className="toyxona-card">
            <p><strong>📍 {t('label_address')}:</strong> {toyxona.address}</p>
            <p><strong>🪑 {t('label_capacity')}:</strong> {toyxona.orindiq_soni} {t('label_seats')}</p>
            <p><strong>📞 {t('label_phone')}:</strong> {toyxona.phone}</p>
            <button className="edit-toyxona-btn" onClick={() => handleEdit(toyxona.id)}>
              {t('edit_button')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerMyToyxonalar;
