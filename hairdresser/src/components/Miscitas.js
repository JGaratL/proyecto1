import React, { useState, useEffect } from 'react';
import '../styles/Miscitas.css';
import axios from 'axios';
import { FaPhone, FaCalendar, FaUser, FaCut, FaArrowRight } from 'react-icons/fa';
import ReactModal from 'react-modal';

const Miscitas = ({ clienteId }) => {
  console.log("clienteId en Miscitas:", clienteId); 

  const [citas, setCitas] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [citaIdToDelete, setCitaIdToDelete] = useState(null); 
  const [citaCanceled, setCitaCanceled] = useState(false);
  const [clienteData, setClienteData] = useState({ nombre: '', apellido: '' }); 

  useEffect(() => {
    const fetchCitas = async () => {
      if (!clienteId) {
        console.error('El clienteId no está definido o es nulo.');
        return;
      }
  
      try {
        const clienteResponse = await axios.get(`http://localhost:5000/obtener-cliente/${clienteId}`);
        const { nombre, apellido } = clienteResponse.data;
        setClienteData({ nombre, apellido });
      } catch (error) {
        console.error('Error obteniendo los datos del cliente', error);
        setError("Hubo un error al obtener los datos del cliente. Por favor, inténtelo nuevamente.");
        return;
      }
  
      const authToken = localStorage.getItem('authToken');
  
      if (!authToken) {
        console.log("No hay un token de autenticación.");
        setError("Por favor, inicie sesión para ver sus citas.");
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/appointments/${clienteId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
  
        const formattedCitas = response.data.map(cita => {
          const date = new Date(cita.fecha);
          const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  
          const formattedDate = localDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
  
          return {
            ...cita,
            fecha: formattedDate,
            fechaOriginal: localDate,
          };
        });
  
        setCitas(formattedCitas);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          localStorage.removeItem('authToken');
          setError("Token inválido o ha expirado. Por favor, inicie sesión nuevamente.");
        } else {
          console.error("Error fetching user's appointments", error);
          setError("Hubo un error al obtener las citas. Por favor, inténtelo nuevamente.");
        }
      }
    };
  
    fetchCitas();
  }, [clienteId, citaCanceled]);
  

  const cancelarCita = async (citaId) => {
    console.log("ID de la cita a cancelar:", citaId);

    try {
      if (!citaId) {
        console.error('ID de cita no válida.');
        return;
      }

      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        console.log("No hay un token de autenticación.");
        setError("Por favor, inicie sesión para ver sus citas.");
        return;
      }

      const response = await axios.delete(`http://localhost:5000/cancel-appointment/${citaId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      console.log('Cita cancelada con éxito', response.data);

      setIsModalOpen(true);
      setCitaIdToDelete(citaId);

    } catch (error) {
      console.error('Error cancelando la cita:', error);
    }
  };

  const today = new Date();
  const citasPasadas = citas.filter(cita => new Date(cita.fechaOriginal) < today);
  const citasFuturas = citas.filter(cita => new Date(cita.fechaOriginal) >= today);

  const closeModal = () => {
    setIsModalOpen(false);
    setCitaIdToDelete(null);
    setCitaCanceled(true);
  };

  return (
    <>
        <div className="miscitas-container">
          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="header-section">
                <h2><FaPhone color="purple" size={24} /> Mis citas</h2>
                <hr />
              </div>

              {citasFuturas.map(cita => (
                <div className="appointment-row" key={cita.fecha + cita.hora}>
                  <div className="column"><FaUser color="purple" size={16} /></div>
                  <div className="column">
                    <span>{clienteData.nombre} {clienteData.apellido}</span><br />
                    {cita.telefono}
                  </div>
                  <div className="column">
                    <FaCalendar color="grey" size={24} /> {cita.fecha}<br />
                    <FaCut color="grey" size={16} /> {cita.servicio}<br /> con {cita.peluquero}
                  </div>
                  <div className="column">
                    <button onClick={() => cancelarCita(cita.cita_id)}>Anular</button>
                  </div>
                </div>
              ))}

              <div className="header-section">
                <h3>Historial de citas</h3>
                <hr />
              </div>

              {citasPasadas.map(cita => (
                <div className="history-row" key={cita.fecha}>
                  <div><FaUser color="purple" size={16} /><span className='nameClient'>{clienteData.nombre} {clienteData.apellido}</span></div>
                  <div><FaCalendar color="grey" size={16} /><span>{cita.fecha}</span></div>
                  <div><FaCut color="grey" size={16} /><span>{cita.servicio} con {cita.peluquero}</span></div>
                </div>
              ))}

              <div className="show-more">
                <p className='lastLine'> Mostrar más <FaArrowRight /></p>
              </div>
            </>
          )}
        </div>
      
      


      <ReactModal
        isOpen={isModalOpen}
        contentLabel="Cita Anulada"
        onRequestClose={closeModal}
      >
        <div className="modal">
          <div className="modal-content">
            <h2>Su cita se ha anulado con éxito.</h2>
            <p>No dudes en pedir tu nueva cita.</p>
            <button className="modal-close-button" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default Miscitas;