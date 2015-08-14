'use strict';

/**
 * ajax service
 */

// cb(post)
function getPost(postId, cb) {
  get('post', {
    postId: postId
  }, cb);
}

// cb(posts)
function getMorePosts(maxId, cb) {
  get('more-posts', {
    maxId: maxId
  }, cb);
}

// cb(posts)
function getHotPosts(cb) {
  get('hot-posts', cb);
}

// cb(comments, more)
function getMoreComments(postId, maxIndex, cb) {
  get('more-comments', {
    postId: postId,
    maxIndex: maxIndex
  }, function (res) {
    cb(res.comments, res.more);
  });
}

// cb(comments)
function getHotComments(postId, cb) {
  get('hot-comments', {
    postId: postId
  }, cb);
}

// cb(null)
function incPostLike(postId, inc, cb) {
  get((inc ? 'inc' : 'dec') + '-post-like', {
    postId: postId
  }, cb);
}

// cb(null)
function incPostDislike(postId, inc, cb) {
  get((inc ? 'inc' : 'dec') + '-post-dislike', {
    postId: postId
  }, cb);
}

// cb(null)
function incCommentLike(postId, commentIndex, inc, cb) {
  get((inc ? 'inc' : 'dec') + '-comment-like', {
    postId: postId,
    commentIndex: commentIndex
  }, cb);
}

// cb(commentIndex)
function postComment(postId, parentIndex, content, cb) {
  post('comment', {
    postId: postId,
    parentIndex: parentIndex,
    content: content
  }, cb);
}

function get() {
  var args = arguments;
  args[0] = '/s/' + args[0];
  $.get.apply($, args);
}

function post() {
  var args = arguments;
  args[0] = '/s/' + args[0];
  $.post.apply($, args);
}

module.exports = {
  getPost: getPost,
  getMorePosts: getMorePosts,
  getHotPosts: getHotPosts,
  getMoreComments: getMoreComments,
  getHotComments: getHotComments,
  incPostLike: incPostLike,
  incPostDislike: incPostDislike,
  incCommentLike: incCommentLike,
  postComment: postComment
};
