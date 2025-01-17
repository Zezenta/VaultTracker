const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const app = express();


app.use(bodyParser.json());
app.use(session({ secret: 'mysecret', resave: false, saveUninitialized: true }));

// Middleware para servir archivos estáticos de manera condicional
function serveStaticAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/vaulttracker');
    }
}

// Sirve archivos estáticos solo si el usuario está autenticado
app.use('/public', serveStaticAuthenticated, express.static(path.join(__dirname, 'public')));

// Leer el archivo JSON con los usuarios
const users = JSON.parse(fs.readFileSync('users.json'));

// Ruta de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.status(200).send();
	console.log("Autenticado");
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.session.user) {
	  console.log("Se comprobó que está autenticado");
    return next();
  }
	console.log("Redirigiendo a /vaulttracker...");
  res.redirect('/vaulttracker');
}

// Ruta protegida del dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
	console.log("Enviando dashboard.html...");
	res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});


// API para datos del usuario
app.get('/api/userdata', isAuthenticated, (req, res) => {
	console.log("Recuperando datos de usuario...");
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

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
