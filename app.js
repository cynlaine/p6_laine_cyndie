//import config variables environnement
require("dotenv").config();

//import des modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

//import des routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

//connexion à la BDD
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

// création de l'application avec express
const app = express();

//CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

//parse les requêtes en json
app.use(express.json());

//définition des routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

//définit une route statique vers le répertoire "images"
app.use("/images", express.static(path.join(__dirname, "images")));

//export
module.exports = app;
