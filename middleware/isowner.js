//import modèle
const Sauce = require("../models/sauce");

//controle si l'user de la requête === que le créateur de la sauce
module.exports = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => { 
        if (sauce.userId = req.auth.userId) {
            next();
        } else {
            res.status(401).json({ message : "Non autorisé"});
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
}