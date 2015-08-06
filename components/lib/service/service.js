'use strict';

/**
 * ajax service
 */

// cb(post)
function getPost(postId, cb) {
  var url = '/s/get-post/' + postId;
  $.get(url, cb);
}

// cb(posts)
function getMorePosts(maxId, cb) {
  var url = '/s/get-more-posts/maxId/' + maxId;
  $.get(url, cb);
}

// cb(posts)
function getHotPosts(cb) {
  var url = '/s/get-hot-posts';
  $.get(url, cb);
}

// cb(comments, more)
function getMoreComments(postId, maxIndex, cb) {
  var url = '/s/get-more-comments/post/' + postId + '/maxIndex/' + maxIndex;
  $.get(url, function (res) {
    cb(res.comments, res.more);
  });
}

// cb(comments)
function getHotComments(postId, cb) {
  var url = '/s/get-hot-comments/post/' + postId;
  $.get(url, cb);
}

// cb(null)
function incPostLike(postId, inc, cb) {
  var url = '/s/' + (inc ? 'inc' : 'dec') + '-like/post/' + postId;
  $.get(url, cb);
}

// cb(null)
function incPostDislike(postId, inc, cb) {
  var url = '/s/' + (inc ? 'inc' : 'dec') + '-dislike/post/' + postId;
  $.get(url, cb);
}

// cb(null)
function incCommentLike(postId, commentIndex, inc, cb) {
  var url = '/s/' + (inc ? 'inc' : 'dec') + '-like/post/' + postId + '/comment/' + commentIndex;
  $.get(url, cb);
}

// cb(commentIndex)
function postComment(postId, parentIndex, content, cb) {
  var url = '/s/post-comment',
      body = {
        postId: postId,
        parentIndex: parentIndex,
        content: content
      };
  $.post(url, body, cb);
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
