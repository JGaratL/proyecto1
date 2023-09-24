import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/Home.css'; 
import logo2image from '../images/logo2.png';


const Home = () => {
  return (
    <div className="home">
      <img className="logoTitle" src={logo2image} alt="Oh My Cut" />
      <p className='maintitle'>Tu Peluquería online</p>
      <Link to="/citanoreg" className="btn btn-dark rounded-pill btn-cita-online">Cita ONLINE</Link>
    </div>
  );
};

export default Home;
