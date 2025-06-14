import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import Navbar from "../components/Navbar"; // Navbar import qilindi, manzilingizga qarab o'zgartiring
import "./AdminLayout.css";

const navItems = [
  { label: "To'yxonalar", path: "/admin/toyxonalar"},
  { label: "To'yxona qo'shish", path: "/admin/add-toyxona"},
  { label: "To'yxona egalari", path: "/admin/owners"},
  { label: "Ega qo'shish", path: "/admin/add-owner"},
  { label: "Barcha bronlar", path: "/admin/bronlar"},
];

const AdminLayout = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Navbar fixed yuqorida */}
      <Navbar />

      {/* Sidebar, top: navbar balandligi hisobga olindi */}
      <aside
        className={`sidebar ${expanded ? "expanded" : ""}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav className="sidebar-nav">
          {navItems.map(({ label, path, icon }) => (
            <Link
              key={path}
              to={path}
              className={`sidebar-link ${
                location.pathname === path ? "active" : ""
              }`}
              title={expanded ? "" : label}
            >
              <span className="sidebar-icon">{icon}</span>
              {expanded && <span className="sidebar-label">{label}</span>}
            </Link>
          ))}
        </nav>
        <button className="logout-button" onClick={handleLogout} title="Chiqish">
          <LogOut size={18} />
          {expanded && <span className="logout-label">Chiqish</span>}
        </button>
      </aside>

      {/* Main content, sidebar kengligiga mos margin-left bilan */}
      <div className={`main-wrapper ${expanded ? "expanded" : ""}`}>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
