const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
//SIGNUP CONTROLLER
//To do --> Add unique validator
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Hash async
        .then(hash => {
            console.log(req.body.username + " " + req.body.email + " " + hash);
            //Creation of the sql instructions
            const sql = `INSERT INTO users (username, email, password) VALUES ("${req.body.username}", "${req.body.email}", "${hash}")`;

            connection.query(sql, function(err, result) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                }
                console.log('connected as id ' + connection.threadId);
                console.log("Table created");
                return res.status(200).json({ message: 'Utilisateur ajouté !' });
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    connection.query(`SELECT * FROM users WHERE username='${req.body.username}'`, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log(rows);

        //If no user find
        if (rows == undefined || rows.length === 0) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        };
        //User find
        console.log("identifiants récupérés");
        console.log(rows[0].id);
        console.log(req.body.password);
        console.log(rows[0].password);

        bcrypt.compare(req.body.password, rows[0].password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                return res.status(200).json({
                    userId: rows[0].id,
                    token: jwt.sign({ userId: rows[0].id },
                        `${process.env.SECRET_TOKEN_KEY}`, { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    });


    /*
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ error: 'Mot de passe incorrect !' });
                        }
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign({ userId: user._id },
                                'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                            )
                        });
                    })
                    .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));*/
};