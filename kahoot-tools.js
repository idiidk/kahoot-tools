const fs = require('fs');

if (!fs.existsSync('./dist')) {
    console.log('Error, please run: `npm run build` before launching the server!')
} else {
    const corsAnywhere = require('cors-anywhere');
    const express = require('express');
    const app = express();

    const host = '0.0.0.0';
    const appPort = 8080;
    const corsPort = 3000;

    app.use(express.static('./dist'))

    app.listen(appPort, () => {
        console.log('Running server on port ' + appPort);
    });

    corsAnywhere.createServer({
        originWhitelist: [], // Allow all origins
        requireHeader: ['origin', 'x-requested-with'],
    }).listen(corsPort, host, function () {
        console.log('Running CORS Anywhere on port ' + corsPort);
    });
}