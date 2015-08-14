'use strict';

var done = require('../lib/done');

module.exports = function (req, res, next, model) {
  var postId = parseInt(req.query.postId),
      maxIndex = parseInt(req.query.maxIndex);
  model('post').getMoreComments(postId, maxIndex, done(res, function (comments, more) {
    res.json({
      comments: comments.reverse(),
      more: more
    });
  }));
};
