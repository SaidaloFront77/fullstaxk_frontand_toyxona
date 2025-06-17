import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import './BronQilish.css';
import { useTranslation } from 'react-i18next';

const BronQilish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [bookedDates, setBookedDates] = useState([]); // array of { date, fullname }
  const [selectedDate, setSelectedDate] = useState('');
  const [form, setForm] = useState({
    fullname: '',
    phone: '',
    count_people: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookedDates = async () => {
    try {
      const res = await axios.get(`/toyxonalar/${id}/booked-dates`);
      const dates = res.data.map(item => ({
        date: item.date.split('T')[0],
        fullname: item.fullname
      }));
      setBookedDates(dates);
    } catch {
      setError(t('error_fetchs'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !form.fullname || !form.phone || Number(form.count_people) <= 0) {
      alert(t('alert_fill_fields'));
      return;
    }

    const isBooked = bookedDates.find(d => d.date === selectedDate);
    if (isBooked) {
      alert(`${selectedDate} ${t('date_already_booked_by')} ${isBooked.fullname}`);
      return;
    }

    try {
      await axios.post('/bron', {
        ...form,
        date: selectedDate,
        toyxona_id: id
      });
      alert(t('alert_success'));
      navigate('/user/bronlar');
    } catch (err) {
      if (err.response?.data?.msg) {
        alert(err.response.data.msg);
      } else {
        alert(t('alert_booking_error'));
      }
    }
  };

  useEffect(() => {
    fetchBookedDates();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const selectedBooked = bookedDates.find(d => d.date === selectedDate);

  if (loading) return <p className="loading-text">{t('loading')}</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="bron-container">
      <h1 className="bron-title">{t('page_title')}</h1>

      <label htmlFor="date" className="bron-label">{t('label_date')}</label>
      <input
        id="date"
        type="date"
        min={today}
        value={selectedDate}
        onChange={(e) => {
          const value = e.target.value;
          const match = bookedDates.find(d => d.date === value);
          if (match) {
            alert(`${value} ${t('date_already_booked_by')} ${match.fullname}`);
            setSelectedDate('');
          } else {
            setSelectedDate(value);
          }
        }}
        className="date-input"
      />

      {selectedBooked && (
        <p className="date-error">
          {t('date_already_booked_by')} <strong>{selectedBooked.fullname}</strong>
        </p>
      )}

      <form className="bron-form" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          placeholder={t('placeholder_fullname')}
          value={form.fullname}
          onChange={e => setForm({ ...form, fullname: e.target.value })}
          className="input-field"
          required
        />
        <input
          type="tel"
          placeholder={t('placeholder_phone')}
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          className="input-field"
          required
          pattern="[0-9+ ]+"
          title={t('phone_title')}
        />
        <input
          type="number"
          placeholder={t('placeholder_count')}
          value={form.count_people}
          onChange={e => setForm({ ...form, count_people: e.target.value })}
          className="input-field"
          required
          min="1"
        />
        <button
          type="submit"
          disabled={!selectedDate || !!selectedBooked}
          className="submit-button"
        >
          {t('submit_button')}
        </button>
      </form>
    </div>
  );
};

export default BronQilish;
