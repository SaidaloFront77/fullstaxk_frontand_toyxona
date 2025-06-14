import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./HomeFiltered.css";
import { useTranslation } from "react-i18next"; // ✅

const rayonlar = [
  "Chilonzor",
  "Mirzo Ulug'bek",
  "Yunusobod",
  "Yakkasaroy",
  "Sergeli",
  "Uchtepa",
  "Olmazor",
  "Shayxontohur",
  "Bektemir",
];

const HomeFiltered = () => {
  const [toyxonalar, setToyxonalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    rayon: "",
    sortBy: "",
    order: "asc",
    search: "",
  });

  const navigate = useNavigate();
  const { t } = useTranslation(); // ✅

  const fetchToyxonalar = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.rayon) params.append("rayon", filters.rayon);
      if (filters.sortBy) {
        params.append("sort_by", filters.sortBy);
        params.append("order", filters.order);
      }
      if (filters.search) params.append("search", filters.search);

      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await axios.get("/public/toyxonalar" + query);
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
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filtered-container">
      <h1 className="filtered-title">{t("title")}</h1>

      <div className="filtered-filters">
        <select
          name="rayon"
          value={filters.rayon}
          onChange={handleFilterChange}
        >
          <option value="">{t("all_districts")}</option>
          {rayonlar.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
        >
          <option value="">{t("no_sorting")}</option>
          <option value="orindiq_narxi">{t("sort_by_price")}</option>
          <option value="orindiq_soni">{t("sort_by_capacity")}</option>
        </select>

        {filters.sortBy && (
          <select
            name="order"
            value={filters.order}
            onChange={handleFilterChange}
          >
            <option value="asc">{t("asc")}</option>
            <option value="desc">{t("desc")}</option>
          </select>
        )}

        <input
          type="text"
          name="search"
          placeholder={t("search_placeholder")}
          value={filters.search}
          onChange={handleFilterChange}
        />
      </div>

      <div className="filtered-cards-wrapper">
        {loading ? (
          <p className="filtered-loading-text">{t("loading")}</p>
        ) : error ? (
          <p className="filtered-error-text">{error}</p>
        ) : toyxonalar.length === 0 ? (
          <p className="filtered-error-text">{t("not_found")}</p>
        ) : (
          toyxonalar.map((hall) => (
            <div
              key={hall.id}
              className="filtered-toyxona-card"
              onClick={() => navigate(`/toyxona/${hall.id}`)}
            >
              {hall.image && (
                <img
                  src={`http://localhost:5000/uploads/${hall.image}`}
                  alt={hall.name}
                  className="filtered-card-image"
                />
              )}
              <h2 className="filtered-card-name">{hall.name}</h2>
              <p className="filtered-card-rayon">{hall.rayon}</p>
              <p className="filtered-card-price">
                {t("price")}: {hall.orindiq_narxi} so‘m
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeFiltered;
