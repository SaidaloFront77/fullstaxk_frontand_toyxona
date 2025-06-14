
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './Bronlar.css';

const Bronlar = () => {
  const [bronlar, setBronlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBronlar = async () => {
    try {
      const res = await axios.get('/admin/bronlar');
      console.log('🔍 Bronlar kelgan maʼlumot:', res.data); // API’dan kelgan ma'lumotni tekshirish uchun
      if (!Array.isArray(res.data)) {
        throw new Error(`API’dan noto‘g‘ri ma'lumot keldi`);
      }
      setBronlar(res.data);
    } catch (err) {
      console.error('Xatolik:', err.message);
      setError('Bronlarni olishda xatolik yuz berdi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bronni bekor qilasizmi?')) return;
    try {
      await axios.delete(`/bron/${id}`);
      fetchBronlar(); // Yangilash
    } catch {
      alert('Bekor qilishda xatolik yuz berdi');
    }
  };

  useEffect(() => {
    fetchBronlar();
  }, []);

  if (loading) return <p className="loading-text">Yuklanmoqda...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (bronlar.length === 0) return <p className="no-data-text">Hech qanday bron topilmadi.</p>;

  return (
    <div className="bronlar-container">
      <h1 className="bronlar-title">Barcha bronlar</h1>
      <div className="bronlar-grid">
        {bronlar.map((b, index) => {
          const dateObj = b.sana ? new Date(b.sana) : null;
          const formattedDate =
            dateObj && !isNaN(dateObj)
              ? dateObj.toLocaleDateString('uz-UZ')
              : 'Nomaʼlum';

          // Foydalanuvchi ma'lumotlarini tekshirish va fallback qo‘shish
          const userFirstName = b.foydalanuvchi?.firstname || 'Nomaʼlum';
          const userLastName = b.foydalanuvchi?.lastname || '';
          const userPhone = b.foydalanuvchi?.phone ? ` (${b.foydalanuvchi.phone})` : '';
          const userFullName = `${userFirstName} ${userLastName}`.trim() || 'Nomaʼlum';

          console.log(`Bron ID: ${b.id}, Foydalanuvchi:`, b.foydalanuvchi); // Debug uchun

          return (
            <div key={b.id} className="bron-card" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="bron-info">
                <p><strong>ID:</strong> {b.id || 'Nomaʼlum'}</p>
                <p><strong>To’yxona:</strong> {b.toyxona || 'Nomaʼlum'}</p>
                <p><strong>Sana:</strong> {formattedDate}</p>
                <p><strong>O’rindiqlar:</strong> {b.count_people || 0}</p>
                <p>
                  <strong>Foydalanuvchi:</strong> {userFullName}{userPhone}
                </p>
                <p className={`status ${b.status?.toLowerCase()}`}>
                  <strong>Status:</strong> {b.status || 'Nomaʼlum'}
                </p>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(b.id)}
              >
                Bekor qilish
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bronlar;
