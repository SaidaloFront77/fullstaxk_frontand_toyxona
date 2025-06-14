import React, { useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import './AddOwner.css';

const AddOwner = () => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/admin/owner', form);
      toast.success('✅ Egasi muvaffaqiyatli qo‘shildi!');
      setForm({ firstname: '', lastname: '', username: '', password: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || '❌ Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addowner-container">
      <h2 className="addowner-title">Yangi To’yxona Egasi Qo‘shish</h2>
      <form className="addowner-form" onSubmit={handleSubmit}>
        <fieldset className="addowner-fieldset" disabled={loading}>
          <div className="form-row">
            <label className="addowner-label">
              Ism:
              <input
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                required
                className="addowner-input"
                placeholder="Ismni kiriting"
              />
            </label>
            <label className="addowner-label">
              Familiya:
              <input
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                required
                className="addowner-input"
                placeholder="Familiyani kiriting"
              />
            </label>
          </div>
          <div className="form-row">
            <label className="addowner-label">
              Username:
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="addowner-input"
                placeholder="Username kiriting"
              />
            </label>
            <label className="addowner-label">
              Parol:
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="addowner-input"
                placeholder="Parol kiriting"
              />
            </label>
          </div>
          <div className="button-container">
            <button type="submit" className="addowner-button">
              {loading ? 'Yuklanmoqda...' : '➕ Qo‘shish'}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddOwner;