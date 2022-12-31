const express = require('express');
const cors = require('cors');
const config = require('better-config');

config.set('../config.json');
const app = express();

app.use(cors());

const port = config.get('application.port');
const host = config.get('application.host');

app.listen(port, host, () => {
    console.log(`Example app listening on port http://${host}:${port}`);
});