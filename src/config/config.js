const dotenv = require("dotenv");

dotenv.config();


const configObject = {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL
};

module.exports = configObject;
