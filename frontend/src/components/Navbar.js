import React from 'react';
import { Link } from 'react-router-dom'; // Usamos Link en lugar de <a>
import './Navbar.css'; // Crearemos este archivo CSS ahora

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/dashboard" className="nav-link">Dashboard</Link>
      <Link to="/tierlist" className="nav-link">Creador de Tier List</Link>
    </nav>
  );
};

export default Navbar;