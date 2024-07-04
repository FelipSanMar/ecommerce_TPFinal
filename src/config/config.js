const dotenv = require("dotenv");


dotenv.config();

const configObject = {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    node_env: process.env.NODE_ENV
};

module.exports = configObject;
