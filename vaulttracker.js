const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const app = express();


app.use(bodyParser.json());
app.use(session({ secret: 'mysecret', resave: false, saveUninitialized: true }));

// Leer el archivo JSON con los usuarios
const users = JSON.parse(fs.readFileSync('users.json'));
var prices = JSON.parse(fs.readFileSync('prices.json'));

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

//dado que cualquier URL más allá de /vaulttracker se redirige hacia acá, y más importante aún,
//dado que /dashboard redirige todo hacia acá (node), se tiene que servir manualmente esto
app.get('/dashboard', isAuthenticated, (req, res) => {
	console.log("Enviando dashboard.html...");
	res.sendFile(path.join(__dirname, 'public', 'dashboard.html')); // dirname/public/dashboard.html 
});
app.get("/dashboard/dashboard.html", isAuthenticated, (req, res) => {
	console.log("checkeando el html manual...");
	res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});
app.get("/dashboard/style.css", isAuthenticated, (req, res) => {
	console.log("sending style");
	res.sendFile(path.join(__dirname, "public", "style.css"));
});
app.get("/dashboard/code.js", isAuthenticated, (req, res) => {
	console.log("sending code");
	res.sendFile(path.join(__dirname, "public", "code.js"));
});

// API para datos del usuario
app.get('/api/userdata', isAuthenticated, (req, res) => {
	console.log("Recuperando datos de usuario...");
    res.json(req.session.user);
});

app.get('/api/prices', isAuthenticated, async (req, res) => {
    res.json(prices)
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
