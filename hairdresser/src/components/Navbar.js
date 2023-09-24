import React from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';
import logo2image from '../images/logo-omc-circle.png';
import { FaUser, FaSearch } from 'react-icons/fa';
import { useLocation, NavLink, Link, useNavigate } from 'react-router-dom';

const Navbar = ({ clienteId, setClienteId }) => {
  console.log("clienteId en Navbar:", clienteId); 
  const navigate = useNavigate(); 
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('clienteId');
    setClienteId(null);
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="main-content">
      <div className="navbar-container">
        <div className="navbar">
          <div className="logo">
            <img className="circle-logo" src={logo2image} alt="Oh my Cut" />
          </div>
          <div className="nav-link">
            <Link className="nav-item" to="/" onClick={() => scrollToSection('home')}>Home</Link>
            <Link className="nav-item" to="/" onClick={() => scrollToSection('servicios')}>Servicios</Link>
            <Link className="nav-item" to="/" onClick={() => scrollToSection('equipo')}>Equipo</Link>
            <Link className="nav-item" to="/" onClick={() => scrollToSection('empleo')}>Empleo</Link>
            <Link className="nav-item" to="/" onClick={() => scrollToSection('contacto')}>Contáctanos</Link>

            {clienteId && location.pathname !== '/Miscitas' && (
              <NavLink className="nav-item" to="/Miscitas">Mis Citas</NavLink>
            )}

            {clienteId && location.pathname === '/Miscitas' && (
              <NavLink className="nav-item active" to="/Miscitas">Mis Citas</NavLink>
            )}

            {clienteId && (
              <NavLink className="nav-item" to="/nuevacita">Nueva Cita</NavLink>
            )}


          </div>
          <div className="actions">
            <FaSearch className="icon" />
            
            {location.pathname !== '/citanoreg' && (
              <NavLink to="/citanoreg">
                <Button variant="dark" className="rounded-pill" style={{ backgroundColor: 'black', color: 'white' }}>
                  Cita ONLINE
                </Button>
              </NavLink>
            )}

            {clienteId && (
              <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
            )}

            {!clienteId && (
              <Link to="/iniciosesion">
                <FaUser className="icon" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
