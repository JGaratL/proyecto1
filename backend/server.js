console.log('Inicio del script');

require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql2 = require('mysql2'); 
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);

const app = express();


const util = require('util');


const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'peluqueria',
    password: '/Ballenita69/',
    database: 'peluqueria'
});

connection.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conexión a la base de datos establecida con el ID ' + connection.threadId);
});

app.use(express.json());
app.use(cors());

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.log('userId extraído del token JWT:', userId); 
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

app.get('/', (req, res) => {
    res.send('Backend funcionando');
});

app.post('/register', async (req, res) => {
    console.log('Petición recibida en /register');
    console.log('Cuerpo de la petición:', req.body);

    const { nombre, apellido, telefono, email, password } = req.body;

    if (!nombre || !apellido || !telefono || !email || !password) {
        return res.status(400).send({ message: 'Todos los campos son obligatorios.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query('INSERT INTO clientes (nombre, apellido, telefono, email, password) VALUES (?, ?, ?, ?, ?)', 
    [nombre, apellido, telefono, email, hashedPassword], 
    (err, results) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        
        const clienteId = results.insertId;

        // Generar token JWT
        const token = jwt.sign({ id: clienteId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).send({ 
            message: 'Usuario registrado exitosamente', 
            clienteId: clienteId, 
            token: token 
        });
    });
});


app.post('/login', (req, res) => {
    console.log("Solicitud recibida en el endpoint /login"); 

    const { email, password } = req.body;

    connection.query('SELECT cliente_id, nombre, apellido, email, password FROM clientes WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (results.length === 0) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        console.log("Usuario encontrado:", results[0]); 

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Usuario completo:', user);

        if (!isMatch) {
            return res.status(400).send({ message: 'Contraseña incorrecta' });
        }

        try {
            const token = jwt.sign({ id: user.cliente_id }, JWT_SECRET, { expiresIn: '2h' }); 

            console.log('Token JWT generado:', token);            
            console.log('ID del cliente:', user.cliente_id); 
            res.status(200).send({ message: 'Inicio de sesión exitoso', cliente_id: user.cliente_id, token }); 
        } catch (error) {
            console.error('Error creando el token JWT:', error);
            res.status(500).send({ message: 'Error interno del servidor al crear el token JWT' });
        }
    });
});


app.post('/create-appointment/unregistered', async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, empleadoNombre, servicioNombre, fecha, horaInicio } = req.body;

        if (!nombre || !apellido || !email || !empleadoNombre || !servicioNombre || !fecha || !horaInicio) {
            return res.status(400).send({ message: 'Todos los campos son obligatorios.' });
        }

        let query = 'SELECT cliente_id FROM clientes WHERE email = ?';
        connection.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Error buscando el cliente:', err);
                return res.status(500).send({ message: 'Error interno del servidor' });
            }

            let cliente_id;

            if (results.length > 0) {
                cliente_id = results[0].cliente_id;
            } else {
                query = 'INSERT INTO clientes (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)';
                connection.query(query, [nombre, apellido, email, telefono], (err, results) => {
                    if (err) {
                        console.error('Error creando el cliente:', err);
                        return res.status(500).send({ message: 'Error interno del servidor' });
                    }
                    
                    cliente_id = results.insertId;
                });
            }

            query = 'SELECT empleado_id FROM empleados WHERE nombre = ?';
            connection.query(query, [empleadoNombre], async (err, results) => {
                if (err) {
                    console.error('Error buscando el empleado:', err);
                    return res.status(500).send({ message: 'Error interno del servidor' });
                }

                if (results.length === 0) {
                    return res.status(404).send({ message: 'Empleado no encontrado' });
                }

                const empleadoId = results[0].empleado_id;

                query = 'SELECT servicio_id FROM servicios WHERE nombre = ?';
                connection.query(query, [servicioNombre], async (err, results) => {
                    if (err) {
                        console.error('Error buscando el servicio:', err);
                        return res.status(500).send({ message: 'Error interno del servidor' });
                    }

                    if (results.length === 0) {
                        return res.status(404).send({ message: 'Servicio no encontrado' });
                    }

                    const servicioId = results[0].servicio_id;

                    query = 'INSERT INTO citas (cliente_id, empleado_id, servicio_id, fecha, hora_inicio) VALUES (?, ?, ?, ?, ?)';
                    connection.query(query, [cliente_id, empleadoId, servicioId, fecha, horaInicio], (err, results) => {
                        if (err) {
                            console.error('Error creando la cita:', err);
                            return res.status(500).send({ message: 'Error interno del servidor' });
                        }

                        res.status(201).send({ message: 'Cita creada exitosamente', citaId: results.insertId });
                    });
                });
            });
        });

    } catch (error) {
        console.error('Error creando la cita:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
});

app.post('/create-appointment/registered', async (req, res) => {
    try {
        const { clienteId, empleadoNombre, servicioNombre, fecha, horaInicio } = req.body;

        if (!clienteId || !empleadoNombre || !servicioNombre || !fecha || !horaInicio) {
            return res.status(400).send({ message: 'Campos obligatorios faltantes.' });
        }

        let query = 'SELECT empleado_id FROM empleados WHERE nombre = ?';
        connection.query(query, [empleadoNombre], async (err, results) => {
            if (err) {
                console.error('Error buscando el empleado:', err);
                return res.status(500).send({ message: 'Error interno del servidor' });
            }

            if (results.length === 0) {
                return res.status(404).send({ message: 'Empleado no encontrado' });
            }

            const empleadoId = results[0].empleado_id;

            query = 'SELECT servicio_id FROM servicios WHERE nombre = ?';
            connection.query(query, [servicioNombre], async (err, results) => {
                if (err) {
                    console.error('Error buscando el servicio:', err);
                    return res.status(500).send({ message: 'Error interno del servidor' });
                }

                if (results.length === 0) {
                    return res.status(404).send({ message: 'Servicio no encontrado' });
                }

                const servicioId = results[0].servicio_id;

                query = 'INSERT INTO citas (cliente_id, empleado_id, servicio_id, fecha, hora_inicio) VALUES (?, ?, ?, ?, ?)';
                connection.query(query, [clienteId, empleadoId, servicioId, fecha, horaInicio], (err, results) => {
                    if (err) {
                        console.error('Error creando la cita:', err);
                        return res.status(500).send({ message: 'Error interno del servidor' });
                    }

                    res.status(201).send({ message: 'Cita creada exitosamente', citaId: results.insertId });
                });
            });
        });

    } catch (error) {
        console.error('Error creando la cita:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
});

app.delete('/cancel-appointment/:citaId', authenticateJWT, async (req, res) => {
    try {
        const { citaId } = req.params;
        const clienteId = req.user.id; 
        const [rows] = await connection.promise().query('SELECT cliente_id FROM citas WHERE cita_id = ?', [citaId]);
        if (rows.length === 0) {
            return res.status(404).send({ message: 'Cita no encontrada' });
        }

        if (rows[0].cliente_id !== clienteId) {
            return res.status(403).send({ message: 'No autorizado para cancelar esta cita' });
        }

        await connection.promise().query('DELETE FROM citas WHERE cita_id = ?', [citaId]);
        res.status(200).send({ message: 'Cita cancelada exitosamente' });
    } catch (error) {
        console.error('Error cancelando la cita:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
});

app.get('/obtener-empleado-id/:nombre', async (req, res) => {
    const nombreEmpleado = req.params.nombre;
    
    try {
        const query = 'SELECT empleado_id FROM empleados WHERE nombre = ?';
        connection.query(query, [nombreEmpleado], (err, results) => {
            if (err) {
                console.error('Error obteniendo el empleado_id:', err);
                return res.status(500).send({ message: 'Error interno del servidor' });
            }

            if (results.length === 0) {
                return res.status(404).send({ message: 'Empleado no encontrado' });
            }

            const empleadoId = results[0].empleado_id;
            res.status(200).send({ empleadoId });
        });
    } catch (error) {
        console.error('Error obteniendo el empleado_id:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
});

app.get('/obtener-servicio-id/:nombre', async (req, res) => {
    const nombreServicio = req.params.nombre;
    
    try {
        const query = 'SELECT servicio_id FROM servicios WHERE nombre = ?';
        connection.query(query, [nombreServicio], (err, results) => {
            if (err) {
                console.error('Error obteniendo el servicio_id:', err);
                return res.status(500).send({ message: 'Error interno del servidor' });
            }

            if (results.length == 0) {
                return res.status(404).send({ message: 'Servicio no encontrado' });
            }

            const servicioId = results[0].servicio_id;
            res.status(200).send({ servicioId });
        });
    } catch (error) {
        console.error('Error obteniendo el servicio_id:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
});

app.get('/obtener-cliente/:clienteId', async (req, res) => {
    const clienteId = req.params.clienteId;

    try {
        const query = 'SELECT nombre, apellido FROM clientes WHERE cliente_id = ?';
        connection.query(query, [clienteId], (err, results) => {
            if (err) {
                console.error('Error obteniendo los datos del cliente:', err);
                return res.status(500).send({ message: 'Error interno del servidor' });
            }

            if (results.length === 0) {
                return res.status(404).send({ message: 'Cliente no encontrado' });
            }

            const clienteData = results[0];
            res.status(200).send(clienteData);
        });
    } catch (error) {
        console.error('Error obteniendo los datos del cliente:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
});

app.get('/appointments/:clienteId', authenticateJWT, async (req, res) => {
    try {
        const clienteId = req.params.clienteId; 
        console.log('clienteId capturado desde req.params:', clienteId);

        const userId = req.user.id; 

        if (clienteId != userId) {
            return res.status(403).json({ message: 'No tienes permiso para acceder a estas citas.' });
        }

        const appointments = await get_user_appointments_from_database(clienteId);

        res.json(appointments);
    } catch (error) {
        console.error('Error al obtener las citas del cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

async function get_user_appointments_from_database(clienteId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT citas.cita_id, citas.fecha, citas.hora_inicio, servicios.nombre AS servicio, empleados.nombre AS peluquero
            FROM citas
            INNER JOIN servicios ON citas.servicio_id = servicios.servicio_id
            INNER JOIN empleados ON citas.empleado_id = empleados.empleado_id
            WHERE citas.cliente_id = ?;
        `;

        connection.query(query, [clienteId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

app.get('/get-occupied-hours', async (req, res) => {
    const { fecha, empleado_id } = req.query;

    try {
        connection.query(
            'SELECT hora_inicio FROM citas WHERE DATE_SUB(fecha, INTERVAL 1 DAY) = ? AND empleado_id = ?',
            [fecha, empleado_id], 
            (error, results) => {
                if (error) {
                    console.error('Error al obtener las horas ocupadas', error);
                    res.status(500).json({ error: 'Error interno del servidor' });
                } else {
                    const occupiedHours = results.map((row) => row.hora_inicio);
                    res.json({ occupiedHours });
                }
            }
        );
    } catch (error) {
        console.error('Error al obtener las horas ocupadas', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


async function get_user_appointments_from_database(clienteId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT citas.cita_id, citas.fecha, citas.hora_inicio, servicios.nombre AS servicio, empleados.nombre AS peluquero
            FROM citas
            INNER JOIN servicios ON citas.servicio_id = servicios.servicio_id
            INNER JOIN empleados ON citas.empleado_id = empleados.empleado_id
            WHERE citas.cliente_id = ?;
        `;

        connection.query(query, [clienteId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}



