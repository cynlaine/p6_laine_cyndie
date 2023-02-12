require("dotenv").config();
const jwt = require("jsonwebtoken");

// décrypte le token pour extraire l'userId
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; //récupère le token de la requête
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY); //déchiffre le token
        const userId = decodedToken.userId; //extrait l'userId du token déchiffré
        req.auth = {
            userId: userId,
        }; //ajoute l'userId à la requête pour qu'il soit exploitable par les routes
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
