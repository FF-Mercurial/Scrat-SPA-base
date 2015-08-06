'use strict';

var express = require('express'),
    model = require('./model');

var router = express.Router();

/**
 * boot
 */

function boot(req, res, next) {
  req.url = router.options.index || '/';
  next();
}

router.get('/p/*', boot);
router.get('/', boot);

/**
 * service
 */

router.get('/s/get-post/:postId', function (req, res) {
  var postId = parseInt(req.params.postId);
  model.getPost(postId, done(res, function (post) {
    res.json(post);
  }));
});

router.get('/s/get-more-posts/maxId/:maxId', function (req, res) {
  var maxId = parseInt(req.params.maxId);
  model.getMorePosts(maxId, done(res, function (posts) {
    posts.forEach(function (post) {
      post.commentsCount = post.comments.length;
      delete post.comments;
    });
    res.json(posts);
  }));
});

router.get('/s/get-hot-posts', function (req, res) {
  model.getHotPosts(done(res, function (posts) {
    posts.forEach(function (post) {
      post.commentsCount = post.comments.length;
      delete post.comments;
    });
    res.json(posts);
  }));
});

router.get('/s/get-more-comments/post/:postId/maxIndex/:maxIndex', function (req, res) {
  var postId = parseInt(req.params.postId),
      maxIndex = parseInt(req.params.maxIndex);
  model.getMoreComments(postId, maxIndex, done(res, function (comments, more) {
    res.json({
      comments: comments.reverse(),
      more: more
    });
  }));
});

router.get('/s/inc-like/post/:postId', function (req, res) {
  var postId = parseInt(req.params.postId);
  model.incPostLike(postId, true, done(res));
});

router.get('/s/dec-like/post/:postId', function (req, res) {
  var postId = parseInt(req.params.postId);
  model.incPostLike(postId, false, done(res));
});

router.get('/s/inc-dislike/post/:postId', function (req, res) {
  var postId = parseInt(req.params.postId);
  model.incPostDislike(postId, true, done(res));
});

router.get('/s/dec-dislike/post/:postId', function (req, res) {
  var postId = parseInt(req.params.postId);
  model.incPostDislike(postId, false, done(res));
});

router.get('/s/inc-like/post/:postId/comment/:commentIndex', function (req, res) {
  var postId = parseInt(req.params.postId),
      commentIndex = parseInt(req.params.commentIndex);
  model.incCommentLike(postId, commentIndex, true, done(res));
});

router.get('/s/dec-like/post/:postId/comment/:commentIndex', function (req, res) {
  var postId = parseInt(req.params.postId),
      commentIndex = parseInt(req.params.commentIndex);
  model.incCommentLike(postId, commentIndex, false, done(res));
});

router.post('/s/post-comment', function (req, res) {
  var postId = parseInt(req.body.postId),
      content = req.body.content,
      parentIndex = req.body.parentIndex;
  model.postComment(postId, parentIndex, content, done(res, function (commentIndex) {
    res.end(commentIndex.toString());
  }));
});

// gen cb with default action
function done(res, cb) {
  return function (err) {
    // default rejecting
    if (err) {
      console.log(err.stack);
      res.status(500).end();
    // default resolving
    } else if (!cb) {
      res.end();
    // call custom cb with no err passed
    } else {
      var args = [].slice.call(arguments, 1);
      cb.apply(null, args);
    }
  }
}

module.exports = function (options) {
  router.options = options || {};
  return router;
};
