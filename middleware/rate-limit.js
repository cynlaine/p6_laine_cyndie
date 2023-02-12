const rateLimit = require("express-rate-limit");

// config de rate-limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limite chaque IP à 3 requêtes par fenêtre (ici 15min)
    standardHeaders: true, // retourne les infos du limiter dans les headers `RateLimit-*`
    legacyHeaders: false, // désactive les headers `X-RateLimit-*`
});

module.exports = limiter;
