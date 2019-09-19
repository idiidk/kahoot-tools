const config = require("./config");

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || config.corsPort;

const cors_proxy = require("cors-anywhere");
cors_proxy.createServer({
  originWhitelist: [],
}).listen(port, host, function () {
  console.log("Running CORS Anywhere on " + host + ":" + port);
});