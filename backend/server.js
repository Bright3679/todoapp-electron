const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authroutes = require('./server/index');
const clc = require('cli-color');
const databaseConnection = require('./config/dbConfig')

const expressApp = express();
const http = require('http').createServer(expressApp);
const PORT = process.env.PORT || 3000;

databaseConnection.connectToDatabase();

expressApp.use(cors());
expressApp.use(bodyParser.json());

expressApp.use((req, res, next) => {
    const startTime = new Date();
    res.on('finish', () => {
        const endTime = new Date();
        const duration = endTime - startTime;

        let statusColor;
        if (res.statusCode >= 500) {
            statusColor = clc.red;
        } else if (res.statusCode >= 400) {
            statusColor = clc.yellow;
        } else if (res.statusCode >= 300) {
            statusColor = clc.cyan;
        } else if (res.statusCode >= 200) {
            statusColor = clc.green;
        } else {
            statusColor = clc.white;
        }

        console.log(`${req.method} ${req.url} - ${statusColor(res.statusCode)} - ${duration}ms`);
    });
    next();
});

expressApp.use('/api', authroutes);

expressApp.get('/', (req, res) => {
    res.send("I am alive");
});

http.listen(PORT, () => {
    console.log("Server is running on Port:", PORT);
});


