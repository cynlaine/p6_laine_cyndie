//import modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//import modèle
const User = require("../models/user");

// création utilisateur
exports.signup = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ message: "Un ou plusieurs champs sont vides" });
    }
    bcrypt
        .hash(req.body.password, 10) //hash du mdp
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() =>
                    res.status(201).json({ message: "Utilisateur créé !" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

// login utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //recherche si email existant dans la bdd
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ message: "Login ou mot de passe incorrect" });
            }
            bcrypt
                .compare(req.body.password, user.password) //compare le mdp saisi avec celui de la bdd
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            message: "Login ou mot de passe incorrect",
                        });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            //crypte userId pour délivrer un token temporaire
                            { userId: user._id },
                            process.env.TOKEN_KEY,
                            { expiresIn: "24h" }
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
