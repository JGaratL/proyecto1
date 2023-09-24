import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; 
import Navbar from './components/Navbar';
import './App.css';
import Servicios from './components/Servicios';
import Home from './components/Home';
import Contacto from './components/Contacto';
import Empleo from './components/Empleo';
import Equipo from './components/Equipo';
import Footer from './components/Footer';
import Citanoreg from './components/Citanoreg';
import InicioSesion from './components/InicioSesion';
import Miscitas from './components/Miscitas';
import NuevaCita from './components/NuevaCita';

function Layout({ children, clienteId, setClienteId }) {
    const location = useLocation();
    
    return (
        <div className="App">
            {location.pathname !== "/iniciosesion" && <Navbar clienteId={clienteId} setClienteId={setClienteId} />}
            {children}
        </div>
    );
}

function App() {
    const [clienteId, setClienteId] = useState(localStorage.getItem('clienteId'));
    useEffect(() => {
    setClienteId(localStorage.getItem('clienteId'));

    console.log("clienteId en App:", clienteId);
    }, [clienteId]);

    return (
        <Router>
            <Layout clienteId={clienteId} setClienteId={setClienteId}>
                <Routes>
                    <Route path="/" element={
                        <div className="background-image">
                            <div id="home"><Home /></div>
                            <div id="servicios"><Servicios /></div>
                            <div id="equipo"><Equipo /></div>
                            <div id="empleo"><Empleo /></div>
                            <div id="contacto"><Contacto /></div>
                            <div id="footer"><Footer /></div>
                        </div>
                    } />
                    <Route path="/Citanoreg" element={<Citanoreg />} />
                    <Route path="/iniciosesion" element={<InicioSesion setClienteId={setClienteId} />} />
                    <Route path="/Miscitas" element={<Miscitas clienteId={clienteId} />} />
                    <Route path="/nuevacita" element={<NuevaCita clienteId={clienteId} />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;