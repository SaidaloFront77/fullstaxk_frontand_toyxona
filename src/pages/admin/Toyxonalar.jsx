import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './Toyxonalar.css';

const rayonlar = [
  "Chilonzor", "Mirzo Ulug'bek", "Yunusobod", "Yakkasaroy",
  "Sergeli", "Uchtepa", "Olmazor", "Shayxontohur", "Bektemir"
];

const Toyxonalar = () => {
  const [toyxonalar, setToyxonalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    rayon: '',
    sort_by: '',
    order: 'asc',
    search: ''
  });

  const navigate = useNavigate();

  const fetchToyxonalar = async () => {
    setLoading(true);
    console.log('Filters:', filters);
    try {
      const params = new URLSearchParams();
      if (filters.rayon) params.append('rayon', filters.rayon);
      if (filters.sort_by) {
        params.append('sort_by', filters.sort_by);
        params.append('order', filters.order);
      }
      if (filters.search) params.append('search', filters.search);

      const query = params.toString() ? `?${params.toString()}` : '';

      console.log('Query params:', query);

      const res = await axios.get('/admin/toyxonalar/filter' + query);
      setToyxonalar(res.data);
      setError(null);
    } catch (err) {
      setError('To’yxonalarni olishda xatolik yuz berdi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToyxonalar();
  }, [filters]);

  const handleTasdiqlash = async (id) => {
    try {
      await axios.patch(`/admin/toyxona/${id}/status`, { status: 'tasdiqlangan' });
      fetchToyxonalar();
    } catch (err) {
      alert("Tasdiqlashda xatolik yuz berdi");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('To’yxonani o‘chirilsinmi?')) return;
    try {
      await axios.delete(`/admin/toyxona/${id}`);
      fetchToyxonalar();
    } catch (err) {
      alert('O‘chirishda xatolik yuz berdi');
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="toyxonalar-container">
      <h1 className="toyxonalar-title">To’yxonalar ro’yxati</h1>

      <div className="filters">
        <select name="rayon" value={filters.rayon} onChange={handleFilterChange}>
          <option value="">Barcha rayonlar</option>
          {rayonlar.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <select name="sort_by" value={filters.sort_by} onChange={handleFilterChange}>
          <option value="">Saralash yo‘q</option>
          <option value="orindiq_narxi">Narx bo‘yicha</option>
          <option value="orindiq_soni">Sig‘im bo‘yicha</option>
        </select>

        {filters.sort_by && (
          <select name="order" value={filters.order} onChange={handleFilterChange}>
            <option value="asc">O‘sish</option>
            <option value="desc">Kamayish</option>
          </select>
        )}

        <input
          type="text"
          name="search"
          placeholder="Qidiruv..."
          value={filters.search}
          onChange={handleFilterChange}
        />
      </div>

      {loading ? (
        <p className="loading-text">Yuklanmoqda...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <table className="toyxonalar-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Rayon</th>
              <th>Manzil</th>
              <th>Sig’im</th>
              <th>Narx</th>
              <th>Status</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {toyxonalar.length === 0 ? (
              <tr>
                <td colSpan="7">To’yxona topilmadi</td>
              </tr>
            ) : (
              toyxonalar.map(t => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.rayon}</td>
                  <td>{t.address}</td>
                  <td>{t.orindiq_soni}</td>
                  <td>{t.orindiq_narxi} so’m</td>
                  <td>{t.status}</td>
                  <td>
                    {t.status !== 'tasdiqlangan' && (
                      <button className="approve-button" onClick={() => handleTasdiqlash(t.id)}>
                        Tasdiqlash
                      </button>
                    )}
                    <button className="delete-button" onClick={() => handleDelete(t.id)}>
                      O‘chirish
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Toyxonalar;
