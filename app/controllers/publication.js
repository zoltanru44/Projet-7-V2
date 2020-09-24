const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const Post = require('../models/post');
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
        return res.status(201).json({ message: 'Publication ajoutée !' });
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
        return res.status(201).json({ message: 'Commentaire ajouté !' });
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
        sql_get_role = `SELECT role FROM users WHERE id ="${req.body.id_user}"`;
        connection.query(sql_get_role, function(err, row) {
            console.log(row);
            console.log(rows);
            if (err) {
                console.error('error connecting: ' + err.stack);
                return res.status(400).json({ err });
            }
            if ((req.body.id_user == rows[0].id_author || row[0].role === 1 || row[0].role === 2)) {
                sql_update_post = `UPDATE posts SET text="${req.body.new_text}",modification_date="${req.body.new_publication_date}", modification_time="${req.body.new_publication_time}" WHERE id="${req.body.id_post}"`
                connection.query(sql_update_post, function(err, result) {
                    if (err) {
                        console.error('error connecting: ' + err.stack);
                        return res.status(400).json({ err });
                    }
                    console.log("Publication mise à jour!")
                    return res.status(201).json({ message: 'Publication mise à jour' });
                })
            } else {
                return res.status(401).json({ message: "Vous n'avez pas les droits d'écriture sur ce post" });
            }
        })
    })
};
//UPDATECOMMENT CONTROLLER
exports.updateComment = (req, res, next) => {
    const sql_get_comment = `SELECT * FROM comments WHERE id='${req.body.id_comment}'`
    connection.query(sql_get_comment, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        if (req.body.new_text == rows[0].text) {
            console.log("Nouveau texte identique au précédent");
            return res.status(401).json({ error: 'Texte identique au précédent' });
        }
        sql_get_role = `SELECT role FROM users WHERE id ="${req.body.id_user}"`;
        connection.query(sql_get_role, function(err, row) {
            console.log(row);
            console.log(rows);
            if (err) {
                console.error('error connecting: ' + err.stack);
                return res.status(400).json({ err });
            }
            if ((req.body.id_user == rows[0].id_author || row[0].role === 1 || row[0].role === 2)) {
                sql_update_comment = `UPDATE comments SET text="${req.body.new_text}",modification_date="${req.body.new_publication_date}", modification_time="${req.body.new_publication_time}" WHERE id="${req.body.id_comment}"`
                connection.query(sql_update_comment, function(err, result) {
                    if (err) {
                        console.error('error connecting: ' + err.stack);
                        return res.status(400).json({ err });
                    }
                    console.log("Commentaire mise à jour!")
                    return res.status(201).json({ message: 'Commentaire mise à jour' });
                })
            } else {
                return res.status(401).json({ message: "Vous n'avez pas les droits d'écriture sur ce commentaire" });
            }
        })
    })
};
//GETPOSTS CONTROLLER
exports.getPosts = (req, res, next) => {
        class Post {
            constructor(date, time, id, id_author, username, modification_date, modification_time, text, comments) {
                this.date = date;
                this.time = time;
                this.id = id;
                this.id_author = id_author;
                this.username = username;
                this.modification_date = modification_date;
                this.modification_time = modification_time;
                this.text = text;
                this.comments = comments;
            }
        }
        class Comment {
            constructor(date, time, id, id_author, id_post, username, modification_date, modification_time, text) {
                this.date = date;
                this.time = time;
                this.id = id;
                this.id_post = id_post;
                this.id_author = id_author;
                this.username = username;
                this.modification_date = modification_date;
                this.modification_time = modification_time;
                this.text = text;
            }
        }
        //Request with JOIN between users and posts
        const sql_get_posts = `SELECT posts.id,posts.id_author,DATE_FORMAT(date,"%Y/%m/%d") as date,time,text,DATE_FORMAT(modification_date,"%Y/%m/%d") as modification_date, modification_time, username 
    FROM posts 
    LEFT JOIN users 
    ON posts.id_author = users.id 
    ORDER By date DESC, time DESC
    LIMIT ${req.query.number_of_posts} 
    OFFSET 0;`
        let allPosts;
        let functionToGetPosts = function() {
            return new Promise(resolve => {
                connection.query(sql_get_posts, (err, rows) => {
                    if (err) {
                        console.error('error connecting: ' + err.stack);
                        return res.status(400).json({ err });
                    }
                    if (rows.length >= 1) {
                        //console.log(rows);
                        console.log(rows[0].date);
                        allPosts = rows;
                        //Boucle récup comm post_id= item.id / Let item from rows

                        //Return rows
                        resolve(allPosts);
                    } else {
                        console.log("Pas de posts trouvés");
                        return res.status(400).json({ err });
                    }
                })
            })
        };
        //function to get comments from one post
        let functionToGetCommentsFromPost = function(item) {
                return new Promise(resolve => {
                    const commentArray = []
                    const sql_get_comments =
                        `SELECT id, id_author, id_post, DATE_FORMAT(date,"%Y/%m/%d") as date,time,text,DATE_FORMAT(modification_date,"%Y/%m/%d") as modification_date, modification_time
                FROM comments
                WHERE comments.id_post= ${item.id}
                ORDER By date DESC, time`
                    connection.query(sql_get_comments, (err, rows) => {
                        if (err) {
                            console.error('error connecting: ' + err.stack);
                            return res.status(400).json({ err });
                        }
                        if (rows.length >= 1) {
                            console.log(rows.length + "commentaires trouvés")
                            console.log(rows);
                            resolve(rows)
                        } else {
                            console.log("Pas de commentaires trouvés");
                            resolve([]);
                        }
                    })
                })
            }
            //Function to get all comments from allposts
        let functionToGetComments = async(allPosts) => {
            let allPostsComplete = [];
            for (let item of allPosts) {
                let commentArray = await functionToGetCommentsFromPost(item)
                console.log(commentArray.length + "commentaires trouvés")
                console.log(item.id);
                let post = new Post(
                    this.date = item.date,
                    this.time = item.time,
                    this.id = item.id,
                    this.id_author = item.id_author,
                    this.username = item.username,
                    this.modification_date = item.modification_date,
                    this.modification_time = item.modification_time,
                    this.text = item.text,
                    this.comments = commentArray,
                );
                allPostsComplete.push(post);


                //await Promise.all(allPromises);
            }
            return allPostsComplete;
        }
        let functionToGetPostsComments = async function() {
            const allPostsGet = await functionToGetPosts();
            const allPostsCommentsGet = await functionToGetComments(allPostsGet)
            console.log("Longeur allPostsGet");
            console.log(allPostsGet.length);
            console.log("Longeur allPostsCommentGet");
            console.log(allPostsCommentsGet.length);
            return res.status(201).json({ allPostsCommentsGet });
        };
        functionToGetPostsComments();

    }
    //GETCOMMENTS CONTROLLER
exports.getComments = (req, res, next) => {
    class Comment {
        constructor(date, time, id, id_author, id_post, username, modification_date, modification_time, text) {
            this.date = date;
            this.time = time;
            this.id = id;
            this.id_post = id_post;
            this.id_author = id_author;
            this.username = username;
            this.modification_date = modification_date;
            this.modification_time = modification_time;
            this.text = text;
        }
    }
    const sql_get_comments =
        `SELECT comments.id, comments.id_author, comments.id_post, DATE_FORMAT(date,"%d/%m/%Y") as date,time,text,DATE_FORMAT(modification_date,"%d/%m/%Y") as modification_date, modification_time, users.username
    FROM comments 
    LEFT JOIN users 
    ON comments.id_author = users.id 
    WHERE comments.id_post= ${req.query.id_post}
    ORDER By date DESC, time 
    LIMIT ${req.query.number}
    OFFSET 0;`

    connection.query(sql_get_comments, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        if (rows.length >= 1) {
            console.log(rows);
            let commentArray = [];
            for (let item of rows) {
                let newComment = new Comment;
                newComment.date = item.date;
                newComment.time = item.time;
                newComment.id = item.id;
                newComment.id_post = item.id_post;
                newComment.id_author = item.id_author;
                newComment.username = item.username;
                newComment.modification_date = item.modification_date;
                newComment.modification_time = item.modification_time;
                newComment.text = item.text;
                commentArray.push(newComment);
            }
            console.log(commentArray);
            return res.status(201).json({ commentArray });
        } else {
            console.log("Pas de commentaires trouvés");
            return res.status(200).json({ message: "Pas de commentaire trouvé" });
        }
    })
};




//DELETEPOST CONTROLLER
exports.deletePost = (req, res, next) => {
        const sql_get_post = `SELECT * FROM posts WHERE id='${req.query.id_post}';`
        connection.query(sql_get_post, (err, rows) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return res.status(400).json({ err });
            }
            sql_get_role = `SELECT role FROM users WHERE id ="${req.query.id_user}"`;
            connection.query(sql_get_role, function(err, row) {
                console.log(row);
                console.log(rows);
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return res.status(400).json({ err });
                }
                if ((req.query.id_user == rows[0].id_author || row[0].role === 1 || row[0].role === 2)) {
                    const sql_delete_post = `DELETE FROM posts WHERE id="${req.query.id_post}"`;
                    connection.query(sql_delete_post, (err, result) => {
                        if (err) {
                            console.error('error connecting: ' + err.stack);
                            return res.status(400).json({ err });
                        } else {
                            return res.status(201).json({ message: "Post supprimé !" });
                        }
                    })
                } else {
                    return res.status(400).json({ message: "Vous n'avez pas les droits sur ce post" });
                }
            })
        })
    }
    //DELETECOMMENT CONTROLLER
exports.deleteComment = (req, res, next) => {
    const sql_get_comment = `SELECT * FROM comments WHERE id='${req.body.id_comment}';`
    connection.query(sql_get_comment, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return res.status(400).json({ err });
        }
        sql_get_role = `SELECT role FROM users WHERE id ="${req.body.id_user}"`;
        connection.query(sql_get_role, function(err, row) {
            console.log(row);
            console.log(rows);
            if (err) {
                console.error('error connecting: ' + err.stack);
                return res.status(400).json({ err });
            }
            if ((req.body.id_user == rows[0].id_author || row[0].role === 1 || row[0].role === 2)) {
                const sql_delete_comment = `DELETE FROM comments WHERE id="${req.body.id_comment}"`;
                connection.query(sql_delete_comment, (err, result) => {
                    if (err) {
                        console.error('error connecting: ' + err.stack);
                        return res.status(400).json({ err });
                    } else {
                        return res.status(201).json({ message: "Commentaire supprimé !" });
                    }
                })
            } else {
                return res.status(400).json({ message: "Vous n'avez pas les droits sur ce commentaire" });
            }
        })
    })
};