const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const app = express();
const CronJob = require('cron').CronJob;
const pricesPath = path.join(__dirname, 'prices.json'); // Ruta del archivo JSON


app.use(bodyParser.json());
app.use(session({ secret: 'mysecret', resave: false, saveUninitialized: true }));

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
    try {
        const data = fs.readFileSync(pricesPath, 'utf8');
        const latestPrices = JSON.parse(data);
        res.json(latestPrices);
    } catch (error) {
        console.error('Error al leer prices.json:', error);
        res.status(500).send('Error al obtener precios');
    }
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});


// Sacar precio diario de BTC
const job = new CronJob('5 0 * * *', async () => { //at 5 minutes past midnight

    try {
        // Obtener el precio actual
        var price = await getPrice();

        // Obtener la fecha actual en formato YYYY-MM-DD
        const date = new Date().toISOString().split('T')[0];

        // Leer el archivo JSON actual
        let data = {};
        if (fs.existsSync(pricesPath)) {
            const fileContent = fs.readFileSync(pricesPath, 'utf8');
            data = fileContent ? JSON.parse(fileContent) : {};
        }

        // Agregar el nuevo precio con la fecha actual
        data[date] = parseFloat(price.toFixed(2));

        // Guardar el archivo actualizado
        fs.writeFileSync(pricesPath, JSON.stringify(data, null, 4));

        console.log(`Precio actualizado: ${date} -> ${data[date]}`);
    } catch (error) {
        console.error('Error al actualizar el archivo:', error);
    }

}, null, true, 'America/Guayaquil');
job.start();

async function getPrice(){
    const response = await fetch("https://blockchain.info/ticker");

    if (!response.ok) {
        console.log("Error al obtener precio de bitcoin")
    }

    const data = await response.json();
    return data.USD.last;
}