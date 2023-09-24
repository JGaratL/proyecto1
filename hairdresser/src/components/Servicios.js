import React from 'react';
import { FaClock } from 'react-icons/fa'; 
import '../styles/Servicios.css';



const Servicios = () => {
  return (
    <div id="servicios">
        <div className="servicios-container">
            <div className='serviciostitle'>
                <h2 className="titulo">NUESTROS SERVICIOS</h2>
                <hr className="linea" />
            </div>
        <table className="tabla">

            <tbody>
            <tr>
                <td>Cortar</td>
                <td><FaClock /> 30 mins</td>
                <td>30 €</td>
            </tr>
            <tr>
                <td>Acondicionamiento</td>
                <td><FaClock /> 30 mins</td>
                <td>30 €</td>
            </tr>
            <tr>
                <td>Tinte natural</td>
                <td><FaClock /> 30 mins</td>
                <td>30 €</td>
            </tr>
            <tr>
                <td>Peinar y lavar</td>
                <td><FaClock /> 60 mins</td>
                <td>55 €</td>
            </tr>
            <tr>
                <td>Cortar y tinte natural</td>
                <td><FaClock /> 60 mins</td>
                <td>40 €</td>
            </tr>
            <tr>
                <td>Cortar y peinar</td>
                <td><FaClock /> 60 mins</td>
                <td>50 €</td>
            </tr>
            <tr>
                <td>Cortar y tinte natural</td>
                <td><FaClock /> 60 mins</td>
                <td>30 €</td>
            </tr>
            </tbody>
        </table>

        </div>
    </div>

  );
};

export default Servicios;
