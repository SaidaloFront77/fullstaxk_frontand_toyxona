import React, { useState } from 'react';
import axios from '../../api/axios';
import './AddToyxona.css';
import { useTranslation } from 'react-i18next'; // ✅ i18n

const rayonlar = [
  "Chilonzor", "Mirzo Ulug'bek", "Yunusobod", "Yakkasaroy",
  "Sergeli", "Uchtepa", "Olmazor", "Shayxontohur", "Bektemir"
];

const AddToyxona = () => {
  const { t } = useTranslation(); // ✅
  const [form, setForm] = useState({
    name: '',
    rayon: '',
    address: '',
    orindiq_soni: '',
    orindiq_narxi: '',
    phone: '',
    images: []
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('rayon', form.rayon);
      formData.append('address', form.address);
      formData.append('orindiq_soni', form.orindiq_soni);
      formData.append('orindiq_narxi', form.orindiq_narxi);
      formData.append('phone', form.phone);

      for (let i = 0; i < form.images.length; i++) {
        formData.append('images', form.images[i]);
      }

      await axios.post('/admin/toyxona', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(t('success_add'));
      setForm({
        name: '',
        rayon: '',
        address: '',
        orindiq_soni: '',
        orindiq_narxi: '',
        phone: '',
        images: []
      });
    } catch (err) {
      setError(err.response?.data?.msg || t('error_add'));
    }
  };

  return (
    <div className="add-toyxona-wrapper">
      <div className="add-toyxona-container">
        <h1 className="add-toyxona-title">{t('titlses')}</h1>

        {error && <p className="add-toyxona-error">{error}</p>}
        {success && <p className="add-toyxona-success">{success}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="add-toyxona-form">
          <input
            type="text"
            name="name"
            placeholder={t('placeholder_name')}
            value={form.name}
            onChange={handleChange}
            required
          />

          <select name="rayon" value={form.rayon} onChange={handleChange} required>
            <option value="">{t('select_rayon')}</option>
            {rayonlar.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <input
            type="text"
            name="address"
            placeholder={t('placeholder_address')}
            value={form.address}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="orindiq_soni"
            placeholder={t('placeholder_capacity')}
            value={form.orindiq_soni}
            onChange={handleChange}
            required
            min="1"
          />

          <input
            type="number"
            name="orindiq_narxi"
            placeholder={t('placeholder_price')}
            value={form.orindiq_narxi}
            onChange={handleChange}
            required
            min="0"
          />

          <input
            type="tel"
            name="phone"
            placeholder={t('placeholder_phone')}
            value={form.phone}
            onChange={handleChange}
            required
            pattern="^\+?\d{9,15}$"
            title={t('phone_title')}
          />

          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
          />

          <button type="submit" className="add-toyxona-submit">{t('submit_buttons')}</button>
        </form>
      </div>
    </div>
  );
};

export default AddToyxona;
