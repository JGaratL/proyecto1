import React from 'react';
import '../styles/Equipo.css';
import woman1 from '../images/woman1.jpg';




const Equipo = () => {
  return (
    <div id="equipo">     
      <div className="seccion-titulo">
        <div className='equipotitle'>
          <h2>NUESTRO EQUIPO</h2>
          <hr className="linea2"/>
        </div>
      </div>
  
      <div className="equipo-container">
        <div className="miembro-equipo">
            <img id="photowoman1" src={woman1} alt="María Roncesalles" />
            <div className="info-miembro">
            <div className="puesto">Executive Manager</div>
            <h3 className="nombre">María Roncesalles</h3>
            <p className="descripcion">
                Una de nuestras más reputadas profesionales de la alta peluquería internacional, María cuenta con un extensísimo curriculum en los mejores salones de la gran manzana neoyorkina. Más de 2 años en Oh My Cut!
            </p>
        </div>
      </div>

        <div className="miembro-equipo">
            <img id="photowoman2" src={woman1} alt="Paula Gutierrez" />
            <div className="info-miembro">
            <div className="puesto">Asistente de Peluquería</div>
            <h3 className="nombre">Paula Gutierrez</h3>
            <p className="descripcion">
                Una de nuestras más reputadas profesionales de la alta peluquería internacional, Paula cuenta con un extensísimo curriculum en los mejores salones de la gran manzana neoyorkina. Más de 2 años en Oh My Cut!
            </p>
            </div>
        </div>

        <div className="miembro-equipo">
            <img id="photowoman3" src={woman1} alt="Carmen Sanz" />
            <div className="info-miembro">
            <div className="puesto">Asistente de Peluquería</div>
            <h3 className="nombre">Carmen Sanz</h3>
            <p className="descripcion">
                Una de nuestras más reputadas profesionales de la alta peluquería internacional, Carmen cuenta con un extensísimo curriculum en los mejores salones de la gran manzana neoyorkina. Más de 2 años en Oh My Cut!
            </p>
            </div>
        </div>
    </div>
    </div> 
  );
  };

export default Equipo;