'use strict';

var app = require('../../app');

module.exports = function (req, res, next) {
    req.url = '/' + app.get('name') + '/' + app.get('version') + '/index.html';
    next();
};
