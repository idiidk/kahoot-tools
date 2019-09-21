const handler = require("serve-handler");
const http = require("http");
const config = require("./config");

const host = process.env.HOST || config.host;
const webPort = process.env.WEB_PORT || config.webPort;
const corsPort = process.env.CORS_PORT || config.corsPort;

const corsProxy = require("cors-anywhere");
const corsServer = corsProxy.createServer({
  originWhitelist: []
});

const webServer = http.createServer((request, response) => {
  return handler(request, response, { public: "./dist/" });
});

corsServer.listen(corsPort, host, function() {
  console.log(`[+] CORS anywhere running on port ${corsPort}`);
});

if (!process.env.PROXY_ONLY) {
  webServer.listen(webPort, host, () => {
    console.log(`[+] Serving site at http://${host}:${webPort}`);
  });
}
