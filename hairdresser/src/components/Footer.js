import React from 'react';
import '../styles/Footer.css'; 
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa'; 
import logo3image from '../images/logo-omc-circle.png';
import lastlogo from '../images/lastlogo.png';



const Footer = () => {
  return (
    <footer>
      <div className="top-footer">
        <div className="logo-column">
        <img className="logotitle" src={logo3image} alt="Oh My Cut" />
        </div>
        <div className="title-column">
          <h4>SOBRE NOSOTROS</h4>
          <ul>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Conoce al equipo</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Visita las instalaciones</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Últimas noticias</a></li>
          </ul>
        </div>
        <div className="title-column">
          <h4>ENLACES DE INTERÉS</h4>
          <ul>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Política de privacidad</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Aviso Legal</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Política de cookies</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Política de cancelación</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Términos y condiciones de uso</a></li>
          </ul>
        </div>
        <div className="title-column">
          <h4>CONTACTO</h4>
          <p>Tel: 668 123 451 / 914 578 324</p>
          <p>E-mail: info@ohmycut.com</p>
          <p>Avenida de Europa, 23</p>
          <p>28224 Pozuelo de Alarcón, Madrid</p>
        </div>
        <div className="social-column">
            <img className="logotitle2" src={lastlogo} alt="Oh My Cut" />
            <div className="redes-sociales">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook style={{ color: 'white' }}  />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter  style={{ color: 'white' }} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram  style={{ color: 'white' }} />
                </a>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp style={{ color: 'white' }}  />
                </a>
            </div>
        </div>
      </div>
      <div className="bottom-footer">
        <div className="copyright-column">
          <p className="right-align">Copyright by Jie&Joaquin. All rights reserved.</p>
        </div>
        <div className="unsitiogenial-column">
          <p className="right-align">@unsitiogenial</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
