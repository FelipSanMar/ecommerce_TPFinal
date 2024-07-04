const express = require("express");
const router = express.Router(); 
//const addLogger = require("./utils/logger.utils.js");


router.get("/", (req, res) => {
    req.logger.fatal("  Mensaje FATAL   - PRIO:0"); 
    req.logger.error("  Mensaje ERROR   - PRIO:1"); 
    req.logger.warning("Mensaje WARNING - PRIO:2"); 
    req.logger.info("   Mensaje INFO    - PRIO:3"); 
    req.logger.http("   Mensaje HTTP    - PRIO:4");
    req.logger.debug("  Mensaje DEBUG   - PRIO:5");

    res.send("Logs generados");
})

module.exports = router;