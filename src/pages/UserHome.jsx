import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./HomeSimple.css";
import { useTranslation } from "react-i18next";

const HomeSimple = () => {
  const [toyxonalar, setToyxonalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchToyxonalar = async () => {
    try {
      const res = await axios.get("/toyxonalar");
      setToyxonalar(res.data);
      setError(null);
    } catch (err) {
      setError(t("error_fetch"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToyxonalar();
  }, []);

  const isLoggedIn = !!localStorage.getItem("token");

  if (loading) return <p className="loading-text">{t("loading")}</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <>
      <div className="animation_Bg"></div>
      <div className="simple-container">
        <h1 className="simple-title">{t("title")}</h1>
        <div className="simple-cards-wrapper">
          {toyxonalar.length === 0 ? (
            <p>{t("no_halls")}</p>
          ) : (
            toyxonalar.map((hall) => (
              <div key={hall.id} className="simple-toyxona-card">
                {hall.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${hall.image}`}
                    alt={hall.name}
                    className="simple-card-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="simple-card-image placeholder">
                    {t("no_image")}
                  </div>
                )}
                <h2 className="simple-card-name">{hall.name}</h2>
                <p className="simple-card-rayon">{hall.rayon}</p>
                <p className="simple-card-price">
                  {t("price")}: {hall.orindiq_narxi} so‘m
                </p>
                <button
                  className="simple-bron-button"
                  onClick={() => {
                    if (isLoggedIn) {
                      navigate(`/toyxona/${hall.id}/bron`);
                    } else {
                      alert(t("register_alert"));
                      navigate("/register");
                    }
                  }}
                >
                  {t("book_now")}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default HomeSimple;
