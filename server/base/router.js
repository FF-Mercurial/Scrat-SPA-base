'use strict';

/**
 * This module auto-loads routes from page/ and service/ to a Router
 * A routes module may export a method-action map(in an object)
 * e.g.
 * module.exports = {
 *  get: function (req, res, next, model, config) {...}
 *  post: function (req, res, next, model, config) {...}
 * }
 * or a single function, with the method default to GET
 * e.g.
 * module.exports = function (req, res, next, model, config) {...}
 * The filename defines the url, with different prefix for page/ and service/
 * We define /p/ for page and /s/ for service
 * e.g.
 * module: page/home.js -> url: /p/home
 * module: service/signin.js -> url: /s/signin
 */

var METHOD_LIST = ['get', 'post', 'put', 'delete', 'patch'];

var router = require('express').Router(),
    path = require('path'),
    fs = require('fs'),
    model = require('./model'),
    config = require('../config'),
    controllerPath = path.join(__dirname, '..', 'controller'),
    pagePath = path.join(controllerPath, 'page'),
    pageUrls = getModulePaths(pagePath),
    servicePath = path.join(controllerPath, 'service'),
    serviceUrls = getModulePaths(servicePath);

/**
 * redirect / and /p/ to /p/index
 */

router.get('/', function(req, res, next){
  req.url = '/p/index';
  next();
});

router.get('/p/*', function(req, res, next){
  req.url = '/p/index';
  next();
});

/**
 * register routes for pages and service
 */

pageUrls.forEach(function (pageUrl) {
  registerRoutes('../controller/page', 'p', pageUrl);
});

serviceUrls.forEach(function (serviceUrl) {
  registerRoutes('../controller/service', 's', serviceUrl);
});

function registerRoutes(dirname, urlPrefix, url) {
  var routes = require('./' + dirname + '/' + url);
  if (typeof routes === 'function') {
    registerRoute('get', routes);
  } else if (typeof routes === 'object') {
    for (var method in routes) registerRoute(method, routes[method]);
  } else {
    throw 'routes should export a function/object';
  }

  function registerRoute(method, action) {
    router[method]('/' + urlPrefix + '/' + url, function (req, res, next) {
      action.call(null, req, res, next, model, config);
    });
  }
}

function getModulePaths(dir) {
  return fs.readdirSync(dir).filter(function (filename) {
    return path.extname(filename) === '.js';
  }).map(function (filename) {
    return path.basename(filename, '.js');
  });
}

module.exports = function () {
  return router;
};
