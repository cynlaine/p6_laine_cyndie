//import modules
const express = require("express");
const router = express.Router();

//imports controllers et middlewares
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const isOwner = require("../middleware/isowner");

//définition des routes
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, isOwner, multer, sauceCtrl.updateSauce);
router.delete("/:id", auth, isOwner, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

//exports
module.exports = router;