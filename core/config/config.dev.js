import path from "path";

let config = {};

config.logFileDir = path.join(__dirname, '../../log');
config.logFileName = 'app.log';
config.dbHost = process.env.dbHost || 'localhost';
config.dbPort = process.env.dbPort || 'port';
config.dbName = process.env.dbName || 'xlsx2query';
config.serverPort = process.env.serverPort || 3000;

export default config;
