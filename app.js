const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const axios = require('axios');


const app = express();
app.use(bodyParser.json());
app.use(session({ secret: 'mysecret', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Leer el archivo JSON con los usuarios
const users = JSON.parse(fs.readFileSync('users.json'));

// Ruta de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.status(200).send();
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login.html');
}

// Ruta protegida del dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});

// API para datos del usuario
app.get('/api/userdata', isAuthenticated, (req, res) => {
  res.json(req.session.user);
});

app.get('/api/bitcoin', async (req, res) => {
    try {
        const response = await axios.get('https://blockchain.info/ticker');
        res.json(response.data); // Devuelve los datos al frontend
    } catch (error) {
        res.status(500).send('Error al obtener datos de la API');
    }
});

// Servir archivos estáticos
app.use(express.static(__dirname + '/public'));


// Iniciar el servidor
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
