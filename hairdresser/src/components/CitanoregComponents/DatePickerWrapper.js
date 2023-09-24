import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { FaCalendar } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/DatePickerWrapper.css';
import woman1 from '../../images/woman1.jpg';

function DatePickerWrapper({
    selectedDate,
    handleDateChange,  
    selectedService,
    handleServiceChange,
    peluqueroSeleccionado,
    handleStylistChange,
    selectedTime,
    handleTimeChange
}) {
    const [occupiedHours, setOccupiedHours] = useState([]);
    const [error, setError] = useState('');

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
        if (selectedDate && peluqueroSeleccionado) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            console.log("Fecha enviada al servidor:", formattedDate);

            fetchEmpleadoId(peluqueroSeleccionado)
                .then((empleadoId) => {
                    if (empleadoId) {
                        console.log("ID del empleado seleccionado:", empleadoId);

                        const apiUrl = `http://localhost:5000/get-occupied-hours?fecha=${formattedDate}&empleado_id=${empleadoId}`;

                        fetch(apiUrl)
                            .then((response) => response.json())
                            .then((data) => {
                                console.log("Horas ocupadas recibidas del servidor:", data);

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
    }, [selectedDate, peluqueroSeleccionado]);

    const availableTimeOptions = [
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30"
    ];

    const filteredTimeOptions = availableTimeOptions.filter((timeOption) => {
        const [hour, minutes] = timeOption.split(':');
        const formattedTimeOption = `${hour}:${minutes}`;
        return !occupiedHours.includes(formattedTimeOption);
    });

    return (
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

            <label className="stylist-label">Selecciona un peluquero:</label>
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
    );
}

export default DatePickerWrapper;
