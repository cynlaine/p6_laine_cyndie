//import config variables environnement
require('dotenv').config();

//import modules
const jwt = require("jsonwebtoken");

// décrypte le token pour extraire l'userId
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; //récupère le token de la requête
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY); //déchiffre le token
        const userId = decodedToken.userId; // extraie l'userId du token déchiffré
        req.auth = { //ajoute l'userId à la requête pour qu'il soit exploitable par les routes
            userId: userId,
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
