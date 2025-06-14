import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "../owner/OwnerBronlar.css";

const OwnerMyToyxona = () => {
  const [toyxona, setToyxona] = useState(null);
  const [bronlar, setBronlar] = useState([]);
  const [selectedBron, setSelectedBron] = useState(null);
  const [bronSet, setBronSet] = useState(new Set());

  const fetchData = async () => {
    try {
      const res = await axios.get("/owner/my-toyxona");
      setToyxona(res.data.toyxona);
      setBronlar(res.data.bronlar);
      setBronSet(new Set(res.data.bronlar.map((b) => b.date)));
    } catch {
      alert("Ma’lumotlarni olishda xatolik");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Bronni bekor qilasizmi?")) return;
    try {
      await axios.delete(`/owner/bronlar/${id}`);
      fetchData();
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Sizga bu bronni o‘chirishga ruxsat yo‘q");
      } else {
        alert(err.response?.data?.msg || "Bekor qilishda xatolik yuz berdi");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDateColor = (date) => {
    const today = new Date().toISOString().split("T")[0];
    if (date < today) return "#ccc";
    return bronSet.has(date) ? "#f77" : "#9f9";
  };

  const handleClick = (date) => {
    const b = bronlar.find((b) => b.date === date);
    if (b) setSelectedBron(b);
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  if (!toyxona) return <p>Yuklanmoqda...</p>;

  return (
    <div className="toyxona-container">
      <h2 className="toyxona-title">{toyxona.name} – Tafsilotlar</h2>
      <div className="toyxona-info">
        <p>
          <strong>📍 Manzil:</strong> {toyxona.address}
        </p>
        <p>
          <strong>🪑 Sig‘im:</strong> {toyxona.orindiq_soni} ta o‘rin
        </p>
        <p>
          <strong>📞 Telefon:</strong> {toyxona.phone}
        </p>
      </div>

      <h3 className="bron-calendar-title">📅 30 kunlik bron holati</h3>
      <div className="bron-calendar">
        {generateDates().map((date) => (
          <div
            key={date}
            onClick={() => handleClick(date)}
            className={`bron-date ${
              getDateColor(date) === "#ccc"
                ? "past"
                : getDateColor(date) === "#f77"
                ? "booked"
                : "available"
            }`}
          >
            {date}
          </div>
        ))}
      </div>

      {selectedBron && (
        <div className="bron-details">
          <h4>📌 Bron tafsilotlari:</h4>
          <p>
            <strong>F.I.Sh:</strong> {selectedBron.fullname}
          </p>
          <p>
            <strong>Telefon:</strong> {selectedBron.phone}
          </p>
          <p>
            <strong>Sana:</strong> {selectedBron.date}
          </p>
          <p>
            <strong>Odam soni:</strong> {selectedBron.count_people}
          </p>
          <button
            className="cancel"
            onClick={() => handleCancel(selectedBron.id)}
          >
            Bekor qilish
          </button>
          <button className="close" onClick={() => setSelectedBron(null)}>
            Yopish
          </button>
        </div>
      )}
    </div>
  );
};

export default OwnerMyToyxona;
