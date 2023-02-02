//import modules
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("mongoose-type-email");

//définition du schéma de données
const userSchema = mongoose.Schema({
    email: { type: mongoose.SchemaTypes.Email, required: true, unique: true },
    password: { type: String, required: true },
});

//vérifie que l'email n'existe pas déjà dans la BDD
userSchema.plugin(uniqueValidator);

//exports
module.exports = mongoose.model("User", userSchema);
