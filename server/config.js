const dotenv = require("dotenv");
dotenv.config();

let config = {};
// Change according to environment, as needed.

config.DB_HOST = process.env.DB_HOST || 'localhost';
config.DB_PORT = process.env.DB_PORT || 27015;
config.DB_USER = process.env.DB_USER || 'admin';
config.DB_PASS = process.env.DB_PASS || '';
config.DB_NAME = process.env.DB_NAME || 'discussione';
config.WEB_PORT = process.env.PORT || 3000;

module.exports = config;
