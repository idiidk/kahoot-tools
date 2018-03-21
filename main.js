const express = require("express");
const path = require("path");
const corsAnywhere = require("cors-anywhere");
const app = express();

const webPort = 8080;
const corsPort = 3000;

app.use(express.static(path.join(__dirname, "public")))

var server = app.listen(webPort, function () {
    console.log("Listening on " + webPort);
});

corsAnywhere.createServer({
    originWhitelist: [],
    requireHeader: ["origin", "x-requested-with"]
}).listen(corsPort, function () {
    console.log("CORS server listening on " + corsPort);
});