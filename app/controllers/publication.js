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

//ADDPOST CONTROLLER
exports.addPost = (req, res, next) => {
    const sql_add_post = `INSERT INTO posts (id_author, date, time, text) VALUES ("${req.body.id_user}","${req.body.publication_date}","${req.body.publication_time}","${req.body.text}")`;
    connection.query(sql_add_post, (err, result) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        return res.status(200).json({ message: 'Publication ajoutée !' });
    })
};

//ADDCOMMENT CONTROLLER
exports.addComment = (req, res, next) => {
    const sql_add_comment = `INSERT INTO comments (id_author, id_post, date, time, text) VALUES ("${req.body.id_user}","${req.body.id_post}","${req.body.publication_date}","${req.body.publication_time}","${req.body.text}")`;
    connection.query(sql_add_comment, (err, result) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        return res.status(200).json({ message: 'Publication ajoutée !' });
    })
};

//UPDATEPOST CONTROLLER
exports.updatePost = (req, res, next) => {

    const sql_get_post = `SELECT * FROM posts WHERE id='${req.body.id_post}'`
    connection.query(sql_get_post, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        if (req.body.new_text == rows[0].text) {
            console.log("Nouveau texte identique au précédent");
            return res.status(401).json({ error: 'Texte identique au précédent' });
        }
        if (req.body.id_user != rows[0].id_author) {
            console.log("Identifiant différent de l'auteur original");
            return res.status(401).json({ error: 'Identifiant différent de l\'auteur original' })
        } else {
            sql_update_post = `UPDATE posts SET text="${req.body.new_text}",modification_date="${req.body.new_publication_date}", modification_time="${req.body.new_publication_time}" WHERE id="${req.body.id_post}"`
            connection.query(sql_update_post, function(err, result) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return res.status(400).json({ err });
                }
                console.log("Publication mise à jour!")
                return res.status(201).json({ err: 'Publication mise à jour' });
            })
        }
    })
};
//UPDATECOMMENT CONTROLLER
exports.updateComment = (req, res, next) => {
    const sql_get_comment = `SELECT * FROM comments WHERE id='${req.body.id_post}'`
    connection.query(sql_get_comment, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        if (req.body.new_text == rows[0].text) {
            console.log("Nouveau texte identique au précédent");
            return res.status(401).json({ error: 'Texte identique au précédent' });
        }
        if (req.body.id_user != rows[0].id_author) {
            console.log("Identifiant différent de l'auteur original");
            return res.status(401).json({ error: 'Identifiant différent de l\'auteur original' })
        } else {
            sql_update_comment = `UPDATE comments SET text="${req.body.new_text}",modification_date="${req.body.new_publication_date}", modification_time="${req.body.new_publication_time}" WHERE id="${req.body.id_post}"`
            connection.query(sql_update_comment, function(err, result) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return res.status(400).json({ err });
                }
                console.log("Commentaire mis à jour!")
                return res.status(201).json({ err: 'Commentaire mis à jour' });
            })
        }
    })
};
//GETPOSTS CONTROLLER
exports.getPosts = (req, res, next) => {
    const sql_get_posts = `SELECT * FROM posts ORDER By date DESC, time LIMIT ${req.body.number_of_posts} OFFSET 0;`
    connection.query(sql_get_posts, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        if (rows.length >= 1) {
            console.log(rows);
            console.log(rows[0].date);
            return res.status(201).json({ rows });
        } else {
            console.log("Pas de posts trouvés");
            return res.status(400).json({ err });
        }
    })
};
//GETCOMMENTS CONTROLLER
exports.getComments = (req, res, next) => {
    const sql_get_comments = `SELECT * FROM comments WHERE id_post="${req.body.id_post}" ORDER By date DESC, time LIMIT ${req.body.number_of_posts} OFFSET 0;`
    connection.query(sql_get_comments, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        if (rows.length >= 1) {
            console.log(rows);

            return res.status(201).json({ rows });
        } else {
            console.log("Pas de commentaires trouvés");
            return res.status(400).json({ err });
        }
    })
};
//DELETEPOST CONTROLLER
exports.deletePost = (req, res, next) => {
    const sql_get_post = `SELECT * FROM posts WHERE id='${req.body.id_post}';`
    connection.query(sql_get_post, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        if (req.body.id_user != rows[0].id_author) {
            return res.status(400).json({ message: "Vous n'avez pas les droits sur ce post" });
        }
        const sql_delete_post = `DELETE FROM posts WHERE id="${req.body.id_post}"`;
        connection.query(sql_delete_post, (err, result) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return res.status(400).json({ err });
            } else {
                return res.status(201).json({ message: "Post supprimé !" });
            }
        })
    })
};
//DELETECOMMENT CONTROLLER
exports.deleteComment = (req, res, next) => {
    const sql_get_comment = `SELECT * FROM comments WHERE id='${req.body.id_comment}';`
    connection.query(sql_get_comment, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        if (req.body.id_user != rows[0].id_author) {
            return res.status(400).json({ message: "Vous n'avez pas les droits sur ce commentaire" });
        }
        const sql_delete_comment = `DELETE FROM comments WHERE id="${req.body.id_comment}"`;
        connection.query(sql_delete_comment, (err, result) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return res.status(400).json({ err });
            } else {
                return res.status(201).json({ message: "Commentaire supprimé !" });
            }
        })
    })
};