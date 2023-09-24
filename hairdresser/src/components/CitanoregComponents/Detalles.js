import React, { useState } from 'react';
import Modal from 'react-modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../styles/Detalles.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


Modal.setAppElement('#root');

function Detalles({
    fechaSeleccionada,
    peluqueroSeleccionado,
    servicioSeleccionado,
    horaSeleccionada,
    nombre: initialNombre,
    apellidos: initialApellidos,
    telefono: initialTelefono,
    email: initialEmail
}) {
    const formattedDate = fechaSeleccionada ? format(fechaSeleccionada, 'EEEE, d \'de\' LLLL \'del\' yyyy', { locale: es }) : 'Fecha no seleccionada';

    const [submittedValues, setSubmittedValues] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        nombre: Yup.string().required('Ingrese un nombre válido.'),
        apellidos: Yup.string().required('Ingrese apellidos válidos.'),
        telefono: Yup.string().matches(/^[0-9]{9}$/, 'Ingrese un número de teléfono válido.'),
        email: Yup.string().email('Ingrese un email válido.').required('Email es requerido')
    });

    const registerAppointment = async (values) => {
        try {
            if (!peluqueroSeleccionado) {
                console.error('Error: No se ha seleccionado un peluquero.');
                return;
            }

            let postData = {
                nombre: values.nombre,
                apellido: values.apellidos,
                email: values.email,
                telefono: values.telefono,
                empleadoNombre: peluqueroSeleccionado, 
                servicioNombre: servicioSeleccionado, 
                fecha: format(fechaSeleccionada, 'yyyy-MM-dd'), 
                horaInicio: horaSeleccionada,
            };

            console.log('Datos enviados en la solicitud:', postData);

            const response = await axios.post(
                'http://localhost:5000/create-appointment/unregistered',
                postData
            );

            console.log('Cita registrada con éxito', response.data);
        } catch (error) {
            console.error('Error registrando la cita', error);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        navigate('/');
    };

    return (
        <div className="detalles-container">
            <h2 className="detalles-title">Detalles de la Cita</h2>
            <hr />

            <Formik
                initialValues={{
                    nombre: initialNombre || '',
                    apellidos: initialApellidos || '',
                    telefono: initialTelefono || '',
                    email: initialEmail || ''
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log("Valores del formulario:", values);
                    setSubmittedValues(values);
                    registerAppointment(values);
                    setModalOpen(true);
                }}
            >
                {({ values }) => {
                    return (
                        <Form className="styled-form">
                            <Field name="nombre" placeholder="Nombre" className="styled-field" />
                            <ErrorMessage name="nombre" component="div" className="error-message" />

                            <Field name="apellidos" placeholder="Apellidos" className="styled-field" />
                            <ErrorMessage name="apellidos" component="div" className="error-message" />

                            <Field name="telefono" placeholder="Teléfono" className="styled-field" />
                            <ErrorMessage name="telefono" component="div" className="error-message" />

                            <Field name="email" placeholder="Email" className="styled-field" />
                            <ErrorMessage name="email" component="div" className="error-message" />

                            <div className="buttons-container">
                                <button type="submit" className="confirm-button" disabled={!fechaSeleccionada || !horaSeleccionada || !servicioSeleccionado || !peluqueroSeleccionado || !values.nombre || !values.apellidos}>Confirmar Cita</button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setModalOpen(false)}
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
                    <p><strong>{submittedValues.nombre} {submittedValues.apellidos}</strong>, tienes una cita el día</p>
                    <p><strong>{formattedDate}</strong></p>
                    <p>a las <strong>{horaSeleccionada}</strong> para <strong>{servicioSeleccionado}</strong> con <strong>{peluqueroSeleccionado}</strong></p>
                    <p>¡Nos vemos!</p>
                    <button className='button-close' onClick={handleCloseModal}>Cerrar</button>
                </div>
            </Modal>
        </div>
    );
}

export default Detalles;
