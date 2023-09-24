import React from 'react';
import '../styles/Contacto.css';
import { Form, Button } from 'react-bootstrap';
import map from '../images/map.jpg';


const Contacto = () => {
  return (
    <div id="contacto" className="contacto-container">
      <div className="imagen-contacto">
      <img id="map" src={map} alt="Foto Cabello" />
      </div>
      <div className="formulario">
        <h2>Contacto</h2>
        <p>Consúltanos tus dudas</p>
        <Form>
          <Form.Group className="input-box">
            <Form.Control type="text" placeholder="Nombre" />
          </Form.Group>
          <Form.Group className="input-box">
            <Form.Control type="email" placeholder="Email" />
          </Form.Group>
          <Form.Group className="input-box">
            <Form.Control type="tel" placeholder="Teléfono" />
          </Form.Group>
          <Form.Group className="input-box">
            <Form.Control as="textarea" rows={4} placeholder="Mensaje" />
          </Form.Group>
        </Form>
        <Form.Check
          type="checkbox"
          label="He leído y acepto la política de privacidad."
          className="checkbox-label"
        />
        <Button variant="dark" className="enviar-button">
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default Contacto;
