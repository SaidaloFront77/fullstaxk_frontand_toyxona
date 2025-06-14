import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';

const ToyxonaDetails = () => {
  const { id } = useParams();
  const [toyxona, setToyxona] = useState(null);
  const [bronlar, setBronlar] = useState([]);
  const [bronSet, setBronSet] = useState(new Set());
  const [selectedBron, setSelectedBron] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/admin/toyxona/${id}`);
      setToyxona(res.data.toyxona);
      setBronlar(res.data.bronDates);
      setBronSet(new Set(res.data.bronDates.map(b => b.date)));
    } catch {
      alert('Ma’lumotlarni olishda xatolik');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDateColor = date => {
    const today = new Date().toISOString().split('T')[0];
    if (date < today) return '#ccc';
    return bronSet.has(date) ? '#f77' : '#9f9';
  };

  const handleClick = date => {
    const b = bronlar.find(b => b.date === date);
    if (b) setSelectedBron(b);
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (!toyxona) return <p>Yuklanmoqda...</p>;

  return (
    <div>
      <h2>{toyxona.name} – tafsilotlari</h2>
      <p><strong>Manzil:</strong> {toyxona.address}</p>
      <p><strong>Sig‘im:</strong> {toyxona.orindiq_soni} ta o‘rin</p>
      <p><strong>Telefon:</strong> {toyxona.phone}</p>

      <h3>📅 30 kunlik bron holati</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {generateDates().map(date => (
          <div
            key={date}
            onClick={() => handleClick(date)}
            style={{
              width: '100px',
              height: '50px',
              background: getDateColor(date),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
          >
            {date}
          </div>
        ))}
      </div>

      {selectedBron && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc' }}>
          <h4>📌 Bron tafsilotlari:</h4>
          <p><strong>F.I.Sh:</strong> {selectedBron.fullname}</p>
          <p><strong>Telefon:</strong> {selectedBron.phone}</p>
          <p><strong>Sana:</strong> {selectedBron.date}</p>
          <p><strong>Odam soni:</strong> {selectedBron.count_people}</p>
          <button onClick={() => setSelectedBron(null)}>Yopish</button>
        </div>
      )}
    </div>
  );
};

export default ToyxonaDetails;
