const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir les fichiers statiques de Vue.js build
app.use(express.static(path.join(__dirname, 'dist')));

// Gérer toutes les autres routes et renvoyer le fichier index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur de développement à l'adresse http://localhost:${port}`);
});
