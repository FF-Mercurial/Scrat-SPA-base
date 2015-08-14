'use strict';

var done = require('../lib/done');

module.exports = function (req, res, next, model) {
  var maxId = parseInt(req.query.maxId);
  model('post').getMorePosts(maxId, done(res, function (posts) {
    posts.forEach(function (post) {
      post.commentsCount = post.comments.length;
      delete post.comments;
    });
    res.json(posts);
  }));
}
