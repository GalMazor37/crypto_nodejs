const path = require('path');

const express = require('express');
const fs = require('fs');

const p = path.join(path.dirname(process.mainModule.filename), 'models', 'cachettl.json');

if (!fs.existsSync(p)) {
    createFile();
}

const myApiKey = 'f7088b3f2add0ebfad3e22460e35b1cd6030d87ba8e2d582ca73499d714bd21d';

const NodeCache = require('node-cache');

const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const myCache = new NodeCache();

function createFile() {
    const ceateCacheFile = { cachettl: 15, admin_key: 123456 };
    const createCacheJson = JSON.stringify(ceateCacheFile);
    fs.writeFileSync(p, createCacheJson);
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const coinsRoutes = require('./routes/coinsRoute');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(coinsRoutes);

app.use(errorController.get404);

app.listen(3000);

exports.myCache = myCache;
