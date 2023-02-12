//import config variables environnement
require("dotenv").config();

//import modules
const http = require("http");
const app = require("./app");

// normalise le port saisi en number
const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// définit le port et le normalise
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// affiche un message avec l'erreur rencontrée
const errorHandler = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges.");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use.");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// démarre le serveur avec app.js
const server = http.createServer(app);

// si serveur KO, exécute errorHandler
server.on("error", errorHandler);
// si serveur OK, affiche quel port ou canal est utilisé
server.on("listening", () => {
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port " + port;
    console.log("Listening on " + bind);
});

// exécute le serveur sur le port désigné
server.listen(port);
