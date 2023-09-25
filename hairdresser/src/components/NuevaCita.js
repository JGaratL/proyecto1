import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { FaCalendar } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/NuevaCita.css';
import woman1 from '../images/woman1.jpg';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

function NuevaCita({   
    userData,
    clienteId
}) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedService, setSelectedService] = useState("");
    const [peluqueroSeleccionado, setPeluqueroSeleccionado] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [occupiedHours, setOccupiedHours] = useState([]);
    const [error, setError] = useState('');
    const [clienteInfo, setClienteInfo] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [citaDetails, setCitaDetails] = useState(null);

    const navigate = useNavigate(); 

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleStylistChange = (stylistName) => {
        setPeluqueroSeleccionado(stylistName);
    };

    const handleServiceChange = (service) => {
        setSelectedService(service);
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };

    const handleCloseModal = () => {
       setIsModalOpen(false);
       navigate('/Miscitas');
    };

    function adjustDateToLocal(date) {
        const fechaLocal = new Date(date);
        fechaLocal.setHours(0, 0, 0, 0);
        return `${fechaLocal.getFullYear()}-${String(fechaLocal.getMonth() + 1).padStart(2, '0')}-${String(fechaLocal.getDate()).padStart(2, '0')}`;
    }
    
      
    const handleConfirmCita = async () => {
        if (!clienteId || !peluqueroSeleccionado || !selectedService || !selectedDate || !selectedTime) {
            alert('Por favor, llena todos los campos.');
            return;
        }
    
        try {
            const dataToSend = {
                clienteId: clienteId,
                empleadoNombre: peluqueroSeleccionado,
                servicioNombre: selectedService,
                fecha: selectedDate ? adjustDateToLocal(selectedDate) : null,
                horaInicio: selectedTime
            };
    
            const response = await fetch('http://localhost:5000/create-appointment/registered', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(dataToSend)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setCitaDetails({
                    nombre: clienteInfo.nombre,
                    apellidos: clienteInfo.apellido,
                    fecha: selectedDate ? adjustDateToLocal(selectedDate) : null,
                    hora: selectedTime,
                    servicio: selectedService,
                    empleado: peluqueroSeleccionado
                });
    
                setIsModalOpen(true); 
            } else {
                alert(data.message || 'Error al crear la cita.');
            }
        } catch (error) {
            console.error('Error al confirmar la cita:', error);
            alert('Error al confirmar la cita. Por favor, inténtalo de nuevo.');
        }
    };
    
    async function fetchEmpleadoId(nombreEmpleado) {
        try {
            const response = await fetch(`http://localhost:5000/obtener-empleado-id/${nombreEmpleado}`);
            const data = await response.json();
            return data.empleadoId;
        } catch (error) {
            console.error('Error al obtener el ID del empleado', error);
            return null;
        }
    }

    useEffect(() => {
        const authToken = localStorage.getItem('token');
        fetch(`http://localhost:5000/obtener-cliente/${clienteId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setClienteInfo(data);
        })
        .catch(error => {
            console.error('Error al obtener datos del cliente', error);
        });

        if (selectedDate && peluqueroSeleccionado) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            fetchEmpleadoId(peluqueroSeleccionado)
                .then((empleadoId) => {
                    if (empleadoId) {
                        const apiUrl = `http://localhost:5000/get-occupied-hours?fecha=${formattedDate}&empleado_id=${empleadoId}`;
                        fetch(apiUrl)
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.error) {
                                    setError(data.error);
                                } else {
                                    const formattedOccupiedHours = data.occupiedHours.map((occupiedHour) => {
                                        const [hour, minutes] = occupiedHour.split(':');
                                        return `${hour}:${minutes}`;
                                    });
                                    setOccupiedHours(formattedOccupiedHours);
                                }
                            })
                            .catch((error) => {
                                setError('Error al obtener las horas ocupadas');
                            });
                    }
                });
        } else {
            setOccupiedHours([]);
            setError('');
        }
    }, [clienteId, selectedDate, peluqueroSeleccionado]);

    const availableTimeOptions = [
        "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
        "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
    ];
    
    const filteredTimeOptions = availableTimeOptions.filter((timeOption) => !occupiedHours.includes(timeOption));

    return (
        <div className="nueva-cita">
            <div className="header">
                <h3>Pedir nueva cita</h3>
            </div>
            <div className="content">
                <div className="info-container">
                    {clienteInfo && (
                        <div>
                            <p className='name-client'>Hola, {clienteInfo.nombre} {clienteInfo.apellido}</p>
                        </div>
                    )}
                    <div className="datepicker-wrapper">
                        <label className="date-label">Seleccione una fecha:</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => handleDateChange(date)}
                            className="date-picker"
                            placeholderText="Calendario"
                            calendarIcon={<FaCalendar />}
                            dateFormat="yyyy-MM-dd"
                        />

                        <label className="service-label">Seleccione un servicio:</label>
                        <div className="service-dropdown">
                            <select
                                className="service-select"
                                value={selectedService}
                                onChange={(e) => handleServiceChange(e.target.value)}
                            >
                                <option value="" disabled>Servicio</option>
                                <option value="Cortar y acondicionamiento">Cortar y acondicionamiento</option>
                                <option value="Tinte natural">Tinte natural</option>
                                <option value="Peinar y lavar">Peinar y lavar</option>
                                <option value="Cortar, tinte natural y peinar">Cortar, tinte natural y peinar</option>
                                <option value="Cortar y peinar">Cortar y peinar</option>
                                <option value="Cortar y tinte natural">Cortar y tinte natural</option>
                                <option value="Peinar y tinte">Peinar y tinte</option>
                            </select>
                        </div>

                        <label className="stylist-label">Seleccione un peluquero:</label>
                        <div className="stylist-section">
                            <div className="stylist" onClick={() => handleStylistChange("Marta")}>
                                <img src={woman1} alt="Marta" className={`stylist-img ${peluqueroSeleccionado === "Marta" ? "selected-stylist" : ""}`} />
                                <span className='namePhoto'>Marta</span>
                            </div>
                            <div className="stylist" onClick={() => handleStylistChange("Paula")}>
                                <img src={woman1} alt="Paula" className={`stylist-img ${peluqueroSeleccionado === "Paula" ? "selected-stylist" : ""}`} />
                                <span className='namePhoto'>Paula</span>
                            </div>
                            <div className="stylist" onClick={() => handleStylistChange("Carmen")}>
                                <img src={woman1} alt="Carmen" className={`stylist-img ${peluqueroSeleccionado === "Carmen" ? "selected-stylist" : ""}`} />
                                <span className='namePhoto'>Carmen</span>
                            </div>
                        </div>

                        <label className="time-label">Seleccione una hora:</label>
                        <div className="time-dropdown">
                            <select
                                className="time-select"
                                value={selectedTime}
                                onChange={(e) => handleTimeChange(e.target.value)}
                            >
                                <option value="" disabled>Horario</option>
                                {error ? (
                                    <option value="" disabled>{error}</option>
                                ) : (
                                    filteredTimeOptions.map((timeOption) => (
                                        <option
                                            key={timeOption}
                                            value={timeOption}
                                        >
                                            {timeOption}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                </div>
    
                </div>
            </div>
            <div className="confirm-button-container">
                <button onClick={handleConfirmCita} className="confirm-button">Confirmar cita</button>
            </div>
            {
            citaDetails &&
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Detalles de la Cita"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        border: 'none',
                        background: 'none',
                        overflow: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        outline: 'none',
                        padding: '0'
                    }
                }}
            >
                <div className="modal-content">
                    <h3 className="title-with-line">Confirmación de la Cita</h3>
                    <p><strong>{citaDetails.nombre} {citaDetails.apellidos}</strong>, tienes una cita el día</p>
                    <p><strong>{citaDetails.fecha}</strong></p>
                    <p>a las <strong>{citaDetails.hora}</strong> para{' '}<strong>{citaDetails.servicio}</strong> con{' '}<strong>{citaDetails.empleado}</strong></p>
                    <p>¡Nos vemos!</p>
                    <button className="button-close" onClick={handleCloseModal}>Cerrar</button>
                </div>
            </Modal>
            }
        </div>
    );
}

export default NuevaCita;
