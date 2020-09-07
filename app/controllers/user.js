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
    // Check if email is already used
    const sql_get_mail = `SELECT * FROM users WHERE email='${req.body.email}'`

    connection.query(sql_get_mail, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(500);
        }
        //If there is already email in database
        if (rows.length >= 1) {
            console.log(rows);
            console.log("email déjà utilisé " + rows.length + " fois")
            return res.status(200).json({ message: 'Email déjà utilisé !' });
        } else {
            //Check is username is already used
            const sql_get_user = `SELECT * FROM users WHERE username='${req.body.username}'`
            connection.query(sql_get_user, (err, rows) => {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return res.status(500).json({ message: 'Problème de server' });
                }
                if (rows.length >= 1) { //If there is already username in database
                    return res.status(200).json({ message: 'Nom d\'utilisateur déjà utilisé' })
                }
                //If username and email are free --> create user
                bcrypt.hash(req.body.password, 10) //Hash async
                    .then(hash => {
                        console.log(req.body.username + " " + req.body.email + " " + hash);
                        //Creation of the sql instructions
                        const sql = `INSERT INTO users (username, email, password) VALUES ("${req.body.username}", "${req.body.email}", "${hash}")`;
                        connection.query(sql, function(err, result) {
                            if (err) {
                                console.error('error connecting: ' + err.stack);
                                return res.status(500).json({ err });
                            }
                            console.log('connected as id ' + connection.threadId);
                            return res.status(201).json({ message: 'Utilisateur ajouté !' });
                        });
                    })
                    .catch(error => res.status(500).json({ error }));
            });
        }
    })
};

//LOGIN CONTROLLER
exports.login = (req, res, next) => {
    const sql_get_user = `SELECT * FROM users WHERE username='${req.body.username}'`
    connection.query(sql_get_user, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(500).json({ err });
        }
        console.log(rows);
        //If no user find
        if (rows == undefined || rows.length === 0) {
            return res.status(401).json({ err: 'Utilisateur non trouvé !' });
        };
        //User find
        console.log("identifiants récupérés");
        bcrypt.compare(req.body.password, rows[0].password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ err: 'Mot de passe incorrect !' });
                }
                return res.status(201).json({
                    userId: rows[0].id,
                    username: rows[0].username,
                    token: jwt.sign({ userId: rows[0].id },
                        `${process.env.SECRET_TOKEN_KEY}`, { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ err }));
    });

};
//UPDATEUSER CONTROLLER
exports.updateUser = (req, res, next) => {
    const sql_get_user = `SELECT * FROM users WHERE id='${req.body.id}'`
    connection.query(sql_get_user, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        console.log(rows);

        const username_user = rows[0].username;
        const email_user = rows[0].email;
        const password_user = rows[0].password;
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
                    console.log("nom d\'utilisateur non différent!")
                };
                if (rows.length >= 1) { //If there is already username in database
                    console.log("Nom d\'utilisateur déjà utilisé")
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
                        console.log("nom d\'utilisateur mis à jour!")
                    })
                }
            })
        }
        //Change email
        if (req.body.new_email) {
            //Check if the new email is free in database
            const sql_get_mail = `SELECT * FROM users WHERE email='${req.body.new_email}'`
            connection.query(sql_get_mail, (err, rows) => {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return res.status(500);
                }
                //New email = old email
                if (email_user == req.body.new_email) {
                    console.log("email non différent!")
                };
                //If there is already email in database
                if (rows.length >= 1) {
                    console.log("email déjà utilisé")
                }
                //The email is free and new email is different than the old
                else if (email_user !== req.body.new_email) {
                    console.log('email différent');
                    const sql_update_email = `UPDATE users SET email="${req.body.new_email}" WHERE id="${req.body.id}"`;
                    connection.query(sql_update_email, function(err, result) {
                        if (err) {
                            console.error('error connecting: ' + err.stack);
                            return res.status(400).json({ err });
                        }
                        console.log("email mis à jour!")
                    })
                }
            })
        }
        //Change password
        if (req.body.new_password && req.body.password) {
            if (req.body.new_password !== req.body.password) {
                console.log('password à changer');
                bcrypt.compare(req.body.password, password_user, function(err, result) {
                    if (result == true) {
                        console.log('mdp ok');
                        bcrypt.hash(req.body.new_password, 10, function(err, hash) {
                            if (err) {
                                console.error('error connecting: ' + err.stack);
                                return res.status(400).json({ error });
                            }
                            const sql_update_password = `UPDATE users SET password="${hash}" WHERE id="${req.body.id}"`;
                            connection.query(sql_update_password, function(err, result) {
                                if (err) {
                                    console.error('error connecting: ' + err.stack);
                                    return res.status(400).json({ error });
                                }
                                console.log('connected as id ' + connection.threadId);
                                console.log('Mot de passe changé');
                            })
                        })
                    } else {
                        console.log("c'est faux");
                    }
                })
            }
        } else {
            console.log("Merci de rentrer l'ancien et le nouveau mot de passe")
        }
        //Last return if no errors
        return res.status(201).json({ message: "Données mises à jour !" });
    })
};

//GETUSER CONTROLLER
exports.getUser = (req, res, next) => {
    const sql_get_user = `SELECT * FROM users WHERE id='${req.body.id}'`
    connection.query(sql_get_user, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ error });
        }
        if (rows.length >= 1) {
            console.log(rows);
            const userGet = {
                id: rows[0].id,
                user_name: rows[0].username,
                email: rows[0].email,
                role: rows[0].role,
            }
            console.log(userGet);
            return res.status(201).json({ userGet });
        } else {
            console.log("user not find");
            return res.status(400).json({ error });
        }
    })
};

//DELETEUSER CONTROLLER
exports.deleteUser = (req, res, next) => {
    const sql_get_user = `SELECT * FROM users WHERE id='${req.body.id}'`;
    connection.query(sql_get_user, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        console.log(rows);
        if (rows.length >= 1) {
            console.log("prêt à supprimer " + rows[0].username);
            bcrypt.compare(req.body.password, rows[0].password, function(err, result) {
                if (result == true) {
                    console.log('mdp ok');
                    sql_delete_user = `DELETE FROM users WHERE id="${req.body.id}"`;
                    connection.query(sql_delete_user, (err, result) => {
                        if (err) {
                            console.error('error connecting: ' + err.stack);
                            return res.status(400).json({ err });
                        }
                        console.log(result);
                        return res.status(201).json({ message: "Utilisateur supprimé !" });
                    });
                } else {
                    console.log("mot de passe faux")
                    return res.status(400).json({ message: "Mauvais mot de passe" });
                }
            })
        } else {
            console.log("user not find");
            return res.status(400).json({ err });
        }

    })
}