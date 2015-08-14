'use strict';

var done = require('../lib/done');

module.exports = function (req, res, next, model) {
  var postId = parseInt(req.query.postId);
  model('post').incPostDislike(postId, false, done(res));
};
