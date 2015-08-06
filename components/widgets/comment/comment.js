'use strict';

var commentTpl = Handlebars.compile(__inline('./comment.html')),
    service = require('lib/service');

function render(postId, comment) {
  var html = commentTpl({
    postId: postId,
    comment: comment
  });
  var $el = $.fromHtml1(html);
  return $el;
}

function addIntersaction($el) {
  var $like = $el.find('.comment__like'),
      $comment = $el.find('.comment__comment'),
      commentIndex = $el.data('index');

  function checkLike(checked) {
    var $likeNum = $like.find('.comment__num'),
        num = parseInt($likeNum.text()) + (checked ? 1 : -1),
        postId = $el.data('post-id');
    $likeNum.text(num);
    service.incCommentLike(postId, commentIndex, checked);
  }

  $like.click(function () {
    $like.toggleClass('common-checked');
    checkLike($like.hasClass('common-checked'));
  });

  $comment.click(function () {
    $el.trigger('comment-clicked', { $el: $el });
  });
}

function addInterface($el) {
  $el.data('get-content', function () {
    return $el.find('.comment__content').text();
  });
}

function init(postId, comment) {
  var $el = render(postId, comment);
  $el.data('post-id', postId);
  $el.data('index', comment.index);
  addIntersaction($el);
  addInterface($el);
  return $el;
}

module.exports = init;
