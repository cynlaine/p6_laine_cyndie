//import modules
const express = require("express");
const router = express.Router();
const limiter = require("../middleware/rate-limit"); // anti bruteforce

//imports controllers
const userCtrl = require("../controllers/user");

//définition des routes
router.post("/signup", userCtrl.signup);
router.post("/login", limiter, userCtrl.login);

//exports
module.exports = router;
