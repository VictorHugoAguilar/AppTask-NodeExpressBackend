const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const bodyParse = require('body-parser');
const config = require('./config/config');
const db = require('./integrations/mongodb');
const compression = require('compression');
const fileUpload = require('express-fileupload');
const listEndpoints = require('express-list-endpoints');
const fs = require('fs');

const path = require('path');

const app = express();

db.connect();

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'hbs');

app.use(cors());
app.use(logger());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public/views')));
app.use(compression());
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());
app.use(fileUpload({
    limits: {
        fileSize: 50 * 1024 * 1024
    }
}));


/*
fs.readdirSync(path.join(__dirname, 'modules/tasks/')).map(file => {
    if (file && file.includes('routes')) {
        require('./modules/tasks/' + file)(app);
    }
});
*/

require('./tasks/tasks.routes')(app);

app.route('/docs').get((req, res) => {
    res.render('docs/index', {
        app: {
            title: 'Render con express y hadlebars',
            descriptions: 'Endpoints'
        },
        endpoints: listEndpoints(app)
    });
});

app.route('/').get((req, res) => {
    res.render('views/index', {
        app: {
            title: 'Render con express y hadlebars',
            descriptions: 'Endpoints'
        }
    });
});




app.listen(config.PORT, err => {
    console.log('Conectado en el puerto', config.PORT);
});