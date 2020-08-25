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
exports.signup = (req, res, next) => {
    //Unique validator first
    const sql_get_user = `SELECT * FROM users WHERE username='${req.body.username}'`
    connection.query(sql_get_user, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(500);
        }
        if (rows.length >= 1) { //If there is already username in database
            return res.status(400).json({ message: 'Nom d\'utilisateur déjà utilisé' })
        } else {
            bcrypt.hash(req.body.password, 10) //Hash async
                .then(hash => {
                    console.log(req.body.username + " " + req.body.email + " " + hash);
                    //Creation of the sql instructions
                    const sql = `INSERT INTO users (username, email, password) VALUES ("${req.body.username}", "${req.body.email}", "${hash}")`;
                    connection.query(sql, function(err, result) {
                        if (err) {
                            console.error('error connecting: ' + err.stack);
                            return res.status(400).json({ error });
                        }
                        console.log('connected as id ' + connection.threadId);
                        return res.status(200).json({ message: 'Utilisateur ajouté !' });
                    });
                })
                .catch(error => res.status(500).json({ error }));
        }
    });
};

//LOGIN CONTROLLER
exports.login = (req, res, next) => {
    const sql_get_user = `SELECT * FROM users WHERE username='${req.body.username}'`
    connection.query(sql_get_user, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ error });
        }
        console.log(rows);
        //If no user find
        if (rows == undefined || rows.length === 0) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        };
        //User find
        console.log("identifiants récupérés");
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

};
//UPDATEUSER CONTROLLER
exports.updateUser = (req, res, next) => {
    const sql_get_user = `SELECT * FROM users WHERE id='${req.body.id}'`
    connection.query(sql_get_user, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ error });
        }
        console.log(rows);

        const username_user = rows[0].username;
        const email_user = rows[0].email;
        //Change username
        if (req.body.new_username) {
            //Check if the new username is free in database
            const sql_get_user = `SELECT * FROM users WHERE username='${req.body.new_username}'`
            connection.query(sql_get_user, (err, rows) => {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return res.status(500);
                }
                //New name = old name
                if (username_user == req.body.new_username) {
                    return res.status(201).json({ error: 'nom d\'utilisateur non différent!' })
                };
                if (rows.length >= 1) { //If there is already username in database
                    return res.status(400).json({ message: 'Nom d\'utilisateur déjà utilisé' })
                }
                //The name is free and new name is different than the old
                else if (username_user !== req.body.new_username) {
                    console.log('username différent');
                    const sql_update_username = `UPDATE users SET username="${req.body.new_username}" WHERE id="${req.body.id}"`;
                    connection.query(sql_update_username, function(err, result) {
                        if (err) {
                            console.error('error connecting: ' + err.stack);
                            return res.status(400).json({ err });
                        }
                        return res.status(201).json({ error: 'nom d\'utilisateur mis à jour!' });
                    })
                }
            })
        } else {
            console.log('pas de username rentré');
            return res.status(401).json({ error: 'pas de user en input' });
        }
    })
};

//GETUSER CONTROLLER
exports.getUser = (req, res, next) => {

};

//DELETEUSER CONTROLLER
exports.deleteUser = (req, res, next) => {

}