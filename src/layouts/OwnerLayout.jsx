import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next"; // ✅
import "./OwnerLayout.css";

const OwnerLayout = () => {
  const { t } = useTranslation(); // ✅
  const location = useLocation();

  const navItems = [
    { label: t("my_hall"), path: "/owner/my-toyxona" },
    { label: t("edit_hall"), path: "/owner/edit-toyxona" },
    { label: t("bookings"), path: "/owner/bronlar" },
    { label: t("add_hall"), path: "/owner/add-toyxona" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="owner-layout">
      {/* Sidebar */}
      <aside className="owner-sidebar">
        <h2 className="owner-sidebar__title">{t("owner_panel")}</h2>
        <nav className="owner-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`owner-nav__link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="owner-logout-btn">
          <LogOut size={18} style={{ marginRight: "5px" }} />
          {t("logout")}
        </button>
      </aside>

      {/* Content */}
      <main className="owner-content">
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;
