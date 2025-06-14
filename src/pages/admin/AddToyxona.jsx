
import React, { useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import './AdminPanel.css';

const rayonlar = [
  "Chilonzor", "Mirzo Ulug'bek", "Yunusobod", "Yakkasaroy", "Sergeli", "Uchtepa", "Olmazor", "Shayxontohur", "Bektemir"
];

const AddToyxona = () => {
  const [form, setForm] = useState({
    name: '',
    rayon: '',
    address: '',
    orindiq_soni: '',
    orindiq_narxi: '',
    phone: '',
    images: []
  });

  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });

    const fileURLs = files.map(file => URL.createObjectURL(file));
    setPreviews(fileURLs);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach(img => formData.append('images', img));
        } else {
          formData.append(key, value);
        }
      });

      await axios.post('/admin/toyxona', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('✅ To’yxona muvaffaqiyatli qo‘shildi!');
      setForm({
        name: '',
        rayon: '',
        address: '',
        orindiq_soni: '',
        orindiq_narxi: '',
        phone: '',
        images: []
      });
      setPreviews([]);
    } catch (err) {
      toast.error(err.response?.data?.msg || '❌ Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Yangi To’yxona Qo‘shish</h2>
      <form className="admin-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-grid">
          <label className="admin-label">
            To’yxona nomi:
            <input
              name="name"
              placeholder="To’yxona nomi"
              value={form.name}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </label>
          <label className="admin-label">
            Rayon:
            <select
              name="rayon"
              value={form.rayon}
              onChange={handleChange}
              className="admin-select"
              required
            >
              <option value="">Rayonni tanlang</option>
              {rayonlar.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="admin-label">
            Manzil:
            <input
              name="address"
              placeholder="Manzil"
              value={form.address}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </label>
          <label className="admin-label">
            Sig’im (o‘rindiqlar soni):
            <input
              name="orindiq_soni"
              type="number"
              placeholder="Sig’im (o‘rindiqlar soni)"
              value={form.orindiq_soni}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </label>
          <label className="admin-label">
            Narx (1 o‘rin uchun):
            <input
              name="orindiq_narxi"
              type="number"
              placeholder="Narx (1 o‘rin uchun)"
              value={form.orindiq_narxi}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </label>
          <label className="admin-label">
            Telefon raqam:
            <input
              name="phone"
              placeholder="Telefon raqam"
              value={form.phone}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </label>
        </div>
        <div className="file-upload-container">
          <label className="admin-label file-label">
            Rasmlar:
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="admin-file-input"
            />
          </label>
        </div>

        {previews.length > 0 && (
          <div className="image-preview-wrapper">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`preview-${i}`}
                className="image-preview"
              />
            ))}
          </div>
        )}

        <div className="button-container">
          <button type="submit" disabled={loading} className="admin-button">
            {loading ? 'Yuklanmoqda...' : '➕ Qo‘shish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddToyxona;