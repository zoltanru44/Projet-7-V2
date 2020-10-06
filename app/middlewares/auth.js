const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log(req.headers.authorization);
        const decodedToken = jwt.verify(token, `${process.env.SECRET_TOKEN_KEY}`);
        const userId = decodedToken.userId;
        console.log("ici");
        console.log(userId);
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            console.log("authentification OK")
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!'),
            message: ("erreur d'authentification")
        });
    }
};