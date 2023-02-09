module.exports = (req, res, next) => {
    let strongPassword =
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    //8 carac min, 1 maj, 1 min, 1 digit & 1 carac special
    let strengthCheck = strongPassword.test(req.body.password);
    if (strengthCheck) {
        next();
    } else {
        return res.status(400).json({
            message: "Le mot de passe n'est pas assez robuste",
        });
    }
};
