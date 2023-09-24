import React from 'react';
import '../styles/Empleo.css';
import pelo from '../images/pelo.jpg';

import { Form, Button } from 'react-bootstrap'; 

const Empleo = () => {
  return (
    <div id="empleo" className="empleo-container">
      <div className="formulario">
        <h2>Únete a nuestro equipo</h2>
        <p>
          ¿Quieres trabajar en un entorno moderno y dinámico, con un equipo joven y preparado? Si tienes experiencia como estilista, te apasiona tu trabajo y quieres crecer en una empresa única y en constante evolución, rellena el cuestionario y entra a formar parte de nuestra familia.
        </p>
        <Form>
          <Form.Group className="input-box">
            <Form.Control type="text" placeholder="Nombre y Apellidos" />
          </Form.Group>
          <Form.Group className="input-box">
            <Form.Control type="text" placeholder="Teléfono" />
          </Form.Group>
          <Form.Group className="input-box">
            <Form.Control type="text" placeholder="Puesto de trabajo deseado" />
          </Form.Group>
          <Form.Group className="input-box">
            <Form.Control type="text" placeholder="Experiencia" />
          </Form.Group>
        </Form>
        <h6>Agregar CV</h6>
        <div className="file-upload">
          <label htmlFor="cv-upload" className="file-label">
            Seleccionar archivo
            <input type="file" id="cv-upload" className="file-input" />
          </label>
          <span>Ningún archivo seleccionado</span>
        </div>
        <Form.Check
          type="checkbox"
          label="He leído y acepto el aviso legal y la política de privacidad."
          className="checkbox-label"
        />
        <Button variant="dark" className="enviar-button">
          Enviar
        </Button>
      </div>
      <div className="imagen-empleo">
        <img id="hair2" src={pelo} alt="Foto Cabello" />
      </div>
    </div>
  );
};

export default Empleo;
