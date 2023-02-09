//import modules
const express = require("express");
const router = express.Router();
const limiter = require("../middleware/rate-limit"); // anti bruteforce
const strengthCheck = require("../middleware/strength-check"); //vérification robustesse mdp
const emailCheck = require("../middleware/email-check");

//imports controllers
const userCtrl = require("../controllers/user");

//définition des routes
router.post("/signup", emailCheck, strengthCheck, userCtrl.signup);
router.post("/login", limiter, userCtrl.login);

//exports
module.exports = router;
