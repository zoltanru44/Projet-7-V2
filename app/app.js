const express = require('express');
const bodyParser = require('body-parser');


const publicationRoutes = require('./routes/publication');
const userRoutes = require('./routes/user');
const path = require('path');
require('dotenv').config();

//Connexion to database mySQL
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});


//app is an express function
const app = express();

//headers to avoid CORS problems
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, cache-control');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Send response as json objects
app.use(bodyParser.json());

//Image folder
app.use('/images', express.static(path.join(__dirname, 'images')));

//Use the router for user requests
app.use('/api/auth', userRoutes);

//Use the router for publication requests
app.use('/api/publication', publicationRoutes);



module.exports = app;