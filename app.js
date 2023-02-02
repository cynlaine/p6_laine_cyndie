//import config variables environnement
require('dotenv').config();

//import des modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

//import des routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

//connexion à la BDD
mongoose.connect(
        // "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PWD + "@cluster0.uyv31cc.mongodb.net/sauce?retryWrites=true&w=majority",
        process.env.MONGO_URI,
        { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"));

// création de l'application avec express
const app = express();

//CORS 
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

//middleware rate limit -> anti bruteforce
const limiter = require("./middleware/rate-limit");
app.use(limiter);

//parse les requêtes en json
app.use(express.json());

//définition des routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

//définit une route statique vers le répertoire "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

//exports
module.exports = app;