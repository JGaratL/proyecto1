const bcrypt = require('bcrypt');

const users = [
  { name: 'María Alvarez', password: 'caCA&&69' },
  { name: 'Sandra Lopez', password: 'pas()2AS' },
  { name: 'Isabel Menez', password: 'creT@M4jA' },
  { name: 'Isabel Ogante', password: 'pitiN69()' },
  { name: 'Carolina Vallerande', password: 'pas()3AS' },
  { name: 'Elsa Capiccias', password: 'P4gA&&&&' },
];

async function hashPasswords() {
  for (let user of users) {
    user.hashedPassword = await bcrypt.hash(user.password, 10);
    console.log(`Nombre: ${user.name}, Contraseña hasheada: ${user.hashedPassword}`);
  }
}

hashPasswords();
