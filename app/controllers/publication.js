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

};
//UPDATEPOST CONTROLLER
exports.updatePost = (req, res, next) => {

};
//UPDATECOMMENT CONTROLLER
exports.updateComment = (req, res, next) => {

};
//GETPOSTS CONTROLLER
exports.getPosts = (req, res, next) => {

};
//GETCOMMENTS CONTROLLER
exports.getComments = (req, res, next) => {

};
//DELETEPOST CONTROLLER
exports.deletePost = (req, res, next) => {

};
//DELETECOMMENT CONTROLLER
exports.deleteComment = (req, res, next) => {

};