'use strict';

var DEFAULT_PORT = 5000;

var meta = require('../package.json'),
    path = require('path'),
    app = module.exports = require('express')();

app.set('name', meta.name);
app.set('version', meta.version);
app.set('port', process.env.PORT || DEFAULT_PORT);
app.set('root', path.resolve(__dirname, '..'));
app.set('logger', console);

app.enable('trust proxy');

var compress = require('compression'),
    bodyParser = require('body-parser'),
    base = ['combo', 'proxy', 'static', 'error', 'router'];

base.forEach(function (m) {
  base[m] = require('./base/' + m);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compress());
app.use('/co', base.combo());
app.use(base.router());
app.use(base.static());
app.use(base.error());
