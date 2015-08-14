'use strict';

var done = require('../lib/done');

module.exports = function (req, res, next, model) {
  var postId = parseInt(req.query.postId),
      commentIndex = parseInt(req.query.commentIndex);
  model('post').incCommentLike(postId, commentIndex, false, done(res));
};
