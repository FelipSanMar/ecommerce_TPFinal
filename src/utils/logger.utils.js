// logger.utils.js

const winston = require("winston");
const configObject = require("../config/config.js");

// Se trae el objeto de la variable de entorno 
const { node_env } = configObject; 

const niveles = {
    nivel: {
        fatal: 0,
        error: 1,
        warning: 2, 
        info: 3, 
        http: 4, 
        debug: 5
    }, 
    colores: {
        fatal: "red", 
        error: "yellow",
        warning: "blue", 
        info: "green", 
        http: "magenta", 
        debug: "white"
    }
};

// Logger para desarrollo
const loggerDesarrollo = winston.createLogger({
    levels: niveles.nivel, 
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors: niveles.colores}),
                winston.format.simple()
            )
        })
    ]
});

// Logger para produccion
const loggerProduccion = winston.createLogger({
    levels: niveles.nivel, 
    transports: [
        new winston.transports.File({
            filename: "./errors.log", 
            level: "info",
            format: winston.format.simple()
        })
    ]
});

// Determinar que logger usar de acuerdo a la variable de entorno (.env)
const logger = node_env === "produccion" ? loggerProduccion : loggerDesarrollo;

// Middleware
// const addLogger = (req, res, next) => {
//     req.logger = logger; 
//     req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
//     next();
// };

// Exportar middleware
//module.exports = addLogger;
//module.exports = { logger, addLogger }; 
module.exports= {logger};