'use strict';

var done = require('../lib/done');

module.exports = function (req, res, next, model) {
  model('post').getHotPosts(done(res, function (posts) {
    posts.forEach(function (post) {
      post.commentsCount = post.comments.length;
      delete post.comments;
    });
    res.json(posts);
  }));
};
