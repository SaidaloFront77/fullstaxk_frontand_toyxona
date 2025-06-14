import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './ToyxonaSingle.css';
import { useTranslation } from 'react-i18next'; // ✅

const ToyxonaSingle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(); // ✅

  const [toyxona, setToyxona] = useState(null);
  const [bronlar, setBronlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/toyxonalar/${id}`);
      const { bronlar, images, ...toyxonaDetails } = res.data;
      setToyxona({ ...toyxonaDetails, images });
      setBronlar(bronlar);
    } catch (err) {
      setError(err.response?.data?.msg || t('error_fetch'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <p className="loading-text">{t('loading')}</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!toyxona) return <p className="notfound-text">{t('not_found')}</p>;

  const openModal = (img) => {
    setModalImg(img);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImg(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="toyxoona-single-container">
      <h2 className="toyxoona-title">{toyxona.name}</h2>

      <div className="image-gallery">
        {toyxona.images?.length > 0 ? (
          toyxona.images.map((img, idx) => (
            <img
              key={idx}
              src={`http://localhost:5000/uploads/${img}`}
              alt={`Rasm ${idx + 1}`}
              className="gallery-image"
              onClick={() => openModal(img)}
              tabIndex={0}
              onKeyPress={e => { if (e.key === 'Enter') openModal(img); }}
            />
          ))
        ) : (
          <p className="no-images">{t('no_images')}</p>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close modal">&times;</button>
            <img src={`http://localhost:5000/uploads/${modalImg}`} alt={t('enlarged_image')} className="modal-image" />
          </div>
        </div>
      )}

      <div className="toyxoona-info">
        <p><strong>{t('district')}:</strong> <span>{toyxona.rayon}</span></p>
        <p><strong>{t('address')}:</strong> <span>{toyxona.address}</span></p>
        <p><strong>{t('capacity')}:</strong> <span>{toyxona.orindiq_soni}</span></p>
        <p><strong>{t('price')}:</strong> <span>{toyxona.orindiq_narxi} so‘m</span></p>
      </div>

      <h3 className="bronlar-title">{t('booked_dates')}</h3>
      <ul className="bronlar-list">
        {bronlar.length === 0 ? (
          <li className="no-bron">{t('no_bookings')}</li>
        ) : (
          bronlar.map((b, i) => (
            <li key={i} className="bronlar-item">
              {new Date(b.date).toLocaleDateString()} - {b.fullname}
            </li>
          ))
        )}
      </ul>

      <button onClick={() => navigate(`/toyxona/${id}/bron`)} className="bron-button">
        {t('book_now')}
      </button>
    </div>
  );
};

export default ToyxonaSingle;
