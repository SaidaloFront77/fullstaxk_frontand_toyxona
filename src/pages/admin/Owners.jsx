import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './Owners.css';

const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/owners');
      setOwners(res.data);
      setError(null);
    } catch (error) {
      setError('Egalarni olishda xatolik yuz berdi');
      console.error('Fetch owners error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Egani o‘chirishni istaysizmi?')) return;

    try {
      await axios.delete(`/admin/owners/${id}`);
      fetchOwners(); // Yangilangan ro‘yxatni qayta olish
    } catch (error) {
      alert('Egani o‘chirishda xatolik yuz berdi');
      console.error('Delete owner error:', error);
    }
  };
  git remote add origin https://github.com/SaidaloFront77/fullstaxk_frontand_toyxona.git
  git branch -M main
  git push -u origin main
  if (loading) return <p className="loading-text">Yuklanmoqda...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="owners-container">
      <h1 className="owners-title">To’yxona egalar ro’yxati</h1>
      <table className="owners-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Ism</th>
            <th>Familiya</th>
            <th>Username</th>
            <th>Amal</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((o, index) => (
            <tr key={o.id}>
              <td>{index + 1}</td>
              <td>{o.firstname}</td>
              <td>{o.lastname}</td>
              <td>{o.username}</td>
              <td>
                <button 
                  className="delete-button" 
                  onClick={() => handleDelete(o.id)}
                >
                  O'chirish
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Owners;
