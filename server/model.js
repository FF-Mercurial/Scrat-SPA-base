'use strict';

/**
 * model layer, using simple db based on json file
 */

var DB_PATH = require('path').join(__dirname, 'db.json'),
    fs = require('fs'),
    db = JSON.parse(fs.readFileSync(DB_PATH)),
    posts = db.posts,
    hotPosts = posts.filter(isHotPost);

var HOT_COMMENTS_SIZE = 3,
    COMMENTS_SIZE = 5,
    POSTS_SIZE = 10;

/**
 * model interfaces
 */

function getPost(postId, cb) {
  var post = clone(getPostById(postId)),
      comments = post.comments;
  setParentContent(comments);
  addIndex(comments);
  var hotComments = comments.filter(isHotComment);
  // sort desc by like
  hotComments.sort(function (a, b) {
    return -(a.like - b.like);
  });
  post.hotComments = hotComments.slice(0, HOT_COMMENTS_SIZE);
  post.commentsCount = comments.length;
  post.commentsMore = comments.length > COMMENTS_SIZE;
  post.comments = comments.reverse().slice(0, COMMENTS_SIZE);
  cb(null, post);
}

function getMorePosts(maxId, cb) {
  if (maxId === -1) {
    var res = posts.slice(0, POSTS_SIZE);
    cb(null, clone(res));
  } else {
    var index = indexOf(maxId);
    var begin = index + 1,
        end = begin + POSTS_SIZE,
        res = posts.slice(begin, end);
    cb(null, clone(res));
  }
}

function getHotPosts(cb) {
  var res = [];
  for (var size = POSTS_SIZE; size >= 0; size--) {
    var post;
    // check duplication
    while (true) {
      post = hotPosts[parseInt(Math.random() * hotPosts.length)];
      if (res.indexOf(post) === -1) break;
    }
    res.push(post);
  }
  cb(null, clone(res));
}

function getMoreComments(postId, maxIndex, cb) {
  var post = getPostById(postId),
      comments = clone(post.comments),
      begin,
      end;
  setParentContent(comments);
  addIndex(comments);
  if (maxIndex === -1) end = comments.length;
  else end = maxIndex;
  begin = end - COMMENTS_SIZE;
  if (end < 0) end = 0;
  if (begin < 0) begin = 0;
  var res = comments.slice(begin, end),
      more = begin > 0;
  cb(null, clone(res), more);
}

function incPostLike(postId, inc, cb) {
  var post = getPostById(postId);
  post.like += (inc ? 1 : -1);
  sync();
  cb();
}

function incPostDislike(postId, inc, cb) {
  var post = getPostById(postId);
  post.dislike += (inc ? 1 : -1);
  sync();
  cb();
}

function incCommentLike(postId, commentIndex, inc, cb) {
  var post = getPostById(postId),
      comment = post.comments[commentIndex];
  comment.like += (inc ? 1 : -1);
  sync();
  cb();
}

// FOR SCRAPPER
function postPost(id, content, like, dislike, comments, cb) {
  var post = {
    id: id,
    content: content,
    like: like,
    dislike: dislike,
    comments: comments
  }
  posts.push(post);
  if (isHotPost(post)) hotPosts.push(post);
  sortPosts();  // TODO: use insert instead of sort
  sync();
  cb();
}

function postComment(postId, parentIndex, content, cb) {
  var post = getPostById(postId),
      commentIndex = post.comments.length;
  post.comments.push({
    content: content,
    parentIndex: parentIndex,
    like: 0
  });
  sync();
  cb(null, commentIndex);
}

/**
 * utils
 */

function isHotPost(post) {
  var like = post.like,
      dislike = post.dislike,
      popularity;
  if (like === 0) popularity = 0;
  else popularity = like * like / (like + dislike);
  return popularity > 100;
}

function isHotComment(comment) {
  var MIN_SUPPORT = 0;
  return comment.like > MIN_SUPPORT;
}

// set parent content to comments
function setParentContent(comments) {
  comments.forEach(function (comment) {
    var parentComment = comments[comment.parentIndex];
    comment.parentContent = parentComment && parentComment.content;
    delete comment.parentIndex;
  });
}

// add index to comments
function addIndex(comments) {
  for (var i = 0; i < comments.length; i++) {
    comments[i].index = i;
  }
}

// deep clone for object/array/simple type
function clone(obj) {
  var res;
  // is array
  if (obj instanceof Array) {
    res = [];
    for (var i = 0; i < obj.length; i++) {
      res.push(clone(obj[i]));
    }
  // is object
  } else if (typeof obj === 'object') {
    res = {};
    for (var key in obj) {
      var value = obj[key];
      res[key] = clone(value);
    }
  // is simple type
  } else {
    return obj;
  }
  return res;
}

// get index of post with spec id
function indexOf(id) {
  for (var i = 0; i < posts.length; i++) {
    if (posts[i].id === id) return i;
  }
  return -1;
}

function getPostById(postId) {
  var postIndex = indexOf(postId);
  return posts[postIndex];
}

// sync db
function sync() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db));
}

// sort posts desc by id
function sortPosts() {
  posts.sort(function (a, b) {
    return -(a.id - b.id);
  });
}
sortPosts();

module.exports = {
  getHotPosts: getHotPosts,
  getMorePosts: getMorePosts,
  getPost: getPost,
  incPostLike: incPostLike,
  incPostDislike: incPostDislike,
  getMoreComments: getMoreComments,
  incCommentLike: incCommentLike,
  postPost: postPost,
  postComment: postComment
}
