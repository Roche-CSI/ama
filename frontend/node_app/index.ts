import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import App from "./app";
import { Logger } from "./logger/logger";

const port = 3000;

App.set("port", port);

const MOUNT_DIR = "/cert";
const KEY = process.env.KEY_FILE_NAME;
const CERT = process.env.CERT_FILE_NAME;

const logger = new Logger();
let server: http.Server | https.Server;

// Check if both key and certificate files exist
if (KEY && CERT && fs.existsSync(`${MOUNT_DIR}/${KEY}`) && fs.existsSync(`${MOUNT_DIR}/${CERT}`)) {
    const options = {
        key: fs.readFileSync(`${MOUNT_DIR}/${KEY}`),
        cert: fs.readFileSync(`${MOUNT_DIR}/${CERT}`)
    };
    server = https.createServer(options, App);
    logger.info("HTTPS server created.");
} else {
    server = http.createServer(App);
    logger.info("HTTP server created.");
}

server.listen(port, () => {
    const addr = server.address();
    const bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(`Listening on ${bind}`);
});

module.exports = App;