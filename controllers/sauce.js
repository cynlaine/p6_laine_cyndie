const Sauce = require("../models/sauce");
const fs = require("fs");

// requête toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

// requête une sauce
exports.getSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(400).json({ error }));
};

// création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); //parse la requête form-data

    delete sauceObject._id; //suppression id transmise par le front
    delete sauceObject._userId; //suppression pour remplacer par le token

    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });

    sauce
        .save()
        .then(() => res.status(201).json({ message: "Sauce créée !" }))
        .catch((error) => res.status(400).json({ error }));
};

// modification d'une sauce
exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file //si requête contient une image on parse le form-data
        ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          }
        : { ...req.body }; //sinon on traite simplement l'objet entrant

    delete sauceObject._userId; //suppression pour remplacer par le token

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (req.file) {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {});
            }
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                .catch((error) => res.status(401).json({ error }));
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

// suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                //supprime l'image
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

// fonction like / dislike
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    switch (like) {
        case 1: //si l'user like la sauce
            Sauce.updateOne(
                { _id: req.params.id },
                { $push: { usersLiked: req.body.userId }, $inc: { likes: 1 } }
            )
                .then(() => res.status(200).json({ message: "Sauce likée" }))
                .catch((error) => res.status(400).json({ error }));
            break;
        case -1: //si l'user dislike la sauce
            Sauce.updateOne(
                { _id: req.params.id },
                {
                    $push: { usersDisliked: req.body.userId },
                    $inc: { dislikes: 1 },
                }
            )
                .then(() => res.status(200).json({ message: "Sauce dislikée" }))
                .catch((error) => res.status(400).json({ error }));
            break;
        case 0: //si l'user annule son like/dislike on supprime son id du tableau correspondant
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $pull: { usersLiked: req.body.userId },
                                $inc: { likes: -1 },
                            }
                        )
                            .then(() => res.status(200).json({ message: "Like supprimé" }))
                            .catch((error) => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $pull: { usersDisliked: req.body.userId },
                                $inc: { dislikes: -1 },
                            }
                        )
                            .then(() => res.status(200).json({ message: "Dislike supprimé" }))
                            .catch((error) => res.status(400).json({ error }));
                    }
                })
                .catch((error) => {
                    res.status(500).json({ error });
                });
            break;
        default:
            res.status(500).json({ error });
    }
};
