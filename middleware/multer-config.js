const multer = require("multer");

// extensions acceptées
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// config storage de Multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    }, // emplacement enregistrement des images
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_"); //garde le nom d'origine et remplace les espaces par des underscores
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension); //renvoie le fichier avec un timestamp
    },
});

module.exports = multer({ storage: storage }).single("image");
