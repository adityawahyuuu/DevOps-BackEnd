const express = require('express');
const cors = require('cors');
const config = require('better-config');
const bodyParser = require('body-parser');
const router = require('./routes');

config.set('../config.json');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/', router);

const port = config.get('application.port');
const host = config.get('application.host');

app.listen(port, host, () => {
    console.log(`Example app listening on port http://${host}:${port}`);
});