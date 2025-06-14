
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './EditToyxona.css';

const EditToyxona = () => {
  const { id } = useParams(); // id faqat admin uchun kerak
  const navigate = useNavigate();

  // Form ma'lumotlari
  const [form, setForm] = useState({
    name: '',
    address: '',
    rayon: '',
    orindiq_soni: '',
    orindiq_narxi: '',
    phone: '',
  });

  // Fayl uchun alohida state (image upload uchun)
  const [image, setImage] = useState(null);

  // Yuklash vaqti, xatolikni saqlash uchun
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // To'yxona ma'lumotlarini olish
  const fetchData = async () => {
    try {
      const endpoint = id ? `/admin/toyxona/${id}` : '/owner/my-toyxona';
      const res = await axios.get(endpoint);

      // Admin uchun to'yxona maydonlari va egalar uchun farq bo'lishi mumkin,
      // shuning uchun tekshirish
      const t = res.data.toyxona || res.data;

      setForm({
        name: t.name || '',
        address: t.address || '',
        rayon: t.rayon || '',
        orindiq_soni: t.orindiq_soni || '',
        orindiq_narxi: t.orindiq_narxi || '',
        phone: t.phone || '',
      });
      setError(null);
    } catch (err) {
      setError('To’yxona ma’lumotlarini olishda xatolik yuz berdi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Form inputlari o'zgarganda
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Form yuborish
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      // Form ma'lumotlarini FormData ga qo'shish
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Agar rasm tanlangan bo'lsa qo'shamiz
      if (image) {
        formData.append('images', image);
      }

      const endpoint = id ? `/admin/toyxona/${id}` : '/owner/my-updatetoyxona';

      await axios.put(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Ma’lumotlar muvaffaqiyatli yangilandi!');
      navigate(id ? '/admin/toyxonalar' : '/owner/dashboard');
    } catch (err) {
      setError('Tahrirlashda xatolik yuz berdi');
      console.error(err);
    }
  };

  if (loading) return <p className="loading-text">Yuklanmoqda...</p>;

  return (
    <div className="edit-toyxona-container">
      <h2 className="edit-title">To’yxona ma’lumotlarini tahrirlash</h2>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="edit-form">
        <div className="form-grid">
          <label className="edit-label">
            Nom:
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="edit-input"
            />
          </label>
          <label className="edit-label">
            Manzil:
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="edit-input"
            />
          </label>
          <label className="edit-label">
            Rayon:
            <input
              name="rayon"
              value={form.rayon}
              onChange={handleChange}
              required
              className="edit-input"
            />
          </label>
          <label className="edit-label">
            Sig’im:
            <input
              type="number"
              name="orindiq_soni"
              value={form.orindiq_soni}
              onChange={handleChange}
              required
              className="edit-input"
            />
          </label>
          <label className="edit-label">
            Narxi (1 o‘rin):
            <input
              type="number"
              name="orindiq_narxi"
              value={form.orindiq_narxi}
              onChange={handleChange}
              required
              className="edit-input"
            />
          </label>
          <label className="edit-label">
            Telefon:
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="edit-input"
            />
          </label>
        </div>
        <label className="edit-label file-label">
          Yangi surat (agar kerak bo‘lsa):
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="edit-file-input"
          />
        </label>
        <div className="button-container">
          <button type="submit" className="edit-button">
            Saqlash
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditToyxona;
