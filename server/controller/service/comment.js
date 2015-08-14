'use strict';

var done = require('../lib/done');

module.exports = {
  post: function (req, res, next, model) {
    var postId = parseInt(req.body.postId),
        content = req.body.content,
        parentIndex = req.body.parentIndex;
    model('post').postComment(postId, parentIndex, content, done(res, function (commentIndex) {
      res.end(commentIndex.toString());
    }));
  }
};
