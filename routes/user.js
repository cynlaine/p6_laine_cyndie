//import modules
const express = require("express");
const router = express.Router();

//imports controllers
const userCtrl = require("../controllers/user");

//définition des routes
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

//exports
module.exports = router;
