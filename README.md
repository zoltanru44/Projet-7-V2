# Projet-7- Réseau social Groupomania
## Technologies utilisées
Front-end :
- Vue
- Vue-router
- Vuetify
- VueX
- Axios
Back-end :
- Bcrypt
- Body-parser
- Dotenv
- Express
- Jsonwebtoken
- MySQL

## Création de la base de donnée SQL
# Création de la base de données
Dans l'interface MySQL connecté avec le compte root
- CREATE DATEBASE <DATABASENAME> CHARACTER SET 'utf8';
- use <DABASENAME>;
- CREATE TABLE users(
id INT AUTO_INCREMENT,
username VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
password VARCHAR(100) NOT NULL,
role TINYINT NOT NULL DEFAULT(3),
PRIMARY KEY (id))
ENGINE=INNODB;
- CREATE TABLE posts(
id INT AUTO_INCREMENT,
id_author INT NOT NULL,
date DATE NOT NULL,
time TIME NOT NULL,
text TEXT,
modification_date DATE,
modification_time TIME,
PRIMARY KEY (id))
ENGINE=INNODB;
- CREATE TABLE comments(
id INT AUTO_INCREMENT,
id_author INT NOT NULL,
id_post INT NOT NULL,
date DATE NOT NULL,
time TIME NOT NULL,
text TEXT,
modification_date DATE,
modification_time TIME,
CONSTRAINT fk_comment_post
    FOREIGN KEY (id_post)
    REFERENCES posts(id)
    ON DELETE CASCADE,
PRIMARY KEY (id))
ENGINE=INNODB;

## Installation de l'API
Dans le dossier app, lancer l'invite de commande
- npm install
## Configuration de l'API
## Installation du front-end
Dans le dossier Frontend_P7, lancer l'invite de commande
- npm install.
## Lancement du serveur local
Dans le dossier app, lancer l'invite de commande
- nodemon server.
Dans le dossier Frontend_P7, lancer l'invite de commande
- npm run serve.
## Lancement du site en local
Le site est maintenant disponible en serveur local: http://localhost:8080/


 
