import React, { useState } from 'react';
import '../styles/Citanoreg.css';
import DatePickerWrapper from './CitanoregComponents/DatePickerWrapper';
import Detalles from './CitanoregComponents/Detalles';

function Citanoreg() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedService, setSelectedService] = useState("");
    const [peluqueroSeleccionado, setPeluqueroSeleccionado] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");

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

    return (
        <div className="citanoreg-container">
            <h1 className="titleDate" style={{ color: '#8D2B63', textAlign: 'center' }}>PEDIR CITA</h1>
            <div className="citanoreg-container2">

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <DatePickerWrapper
                        selectedDate={selectedDate}
                        handleDateChange={handleDateChange}
                        selectedService={selectedService}
                        handleServiceChange={handleServiceChange}
                        peluqueroSeleccionado={peluqueroSeleccionado}
                        handleStylistChange={handleStylistChange}
                        selectedTime={selectedTime}
                        handleTimeChange={handleTimeChange}
                    />
                </div>

                <Detalles
                    fechaSeleccionada={selectedDate}
                    servicioSeleccionado={selectedService}
                    horaSeleccionada={selectedTime}
                    peluqueroSeleccionado={peluqueroSeleccionado}
                />
            </div>
        </div>
    );
}

export default Citanoreg;
