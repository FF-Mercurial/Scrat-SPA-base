'use strict';

var $PostDetail = require('widgets/post-detail'),
    $CommentBox = require('widgets/comment-box'),
    framework = require('widgets/framework'),
    detailTpl = Handlebars.compile(__inline('./detail.html')),
    service = require('lib/service');

function render(postId) {
  var html = detailTpl(),
      $content = $.fromHtml1(html),
      $el = framework.init($content);
  service.getPost(postId, function (post) {
    var $postDetail = $PostDetail(post),
        $commentBox = $CommentBox(postId, post.hotComments, post.comments, post.commentsMore);
    $postDetail.insertAt($content.find('.include__post-detail'));
    $commentBox.insertAt($content.find('.include__comment-box'));
  });
  return $el;
}

function init(postId) {
  var $el = render(postId);
  return $el;
}

module.exports = init;
