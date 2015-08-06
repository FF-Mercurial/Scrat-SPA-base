'use strict';

var $Comment = require('widgets/comment'),
    commentBoxTpl = Handlebars.compile(__inline('./comment-box.html')),
    service = require('lib/service');

function render() {
  var html = commentBoxTpl(),
      $el = $.fromHtml1(html);
  return $el;
}

function initData($el, postId) {
  $el.data('post-id', postId);
  $el.data('max-index', -1);
  $el.data('parent-index', -1);
}

function addIntersaction($el) {
  var $commentInput = $el.find('.comment-box__comment-input'),
      $commentButton = $el.find('.comment-box__comment-button'),
      $commentMore = $el.find('.comment-box__comment-more'),
      $commentList = $el.find('.comment-box__comment-list'),
      postId = $el.data('post-id');
  // post comment
  $commentButton.click(function () {
    var content = $commentInput.val(),
        parentIndex = $el.data('parent-index');
    $commentInput.val('');
    service.postComment(postId, parentIndex, content, function (commentIndex) {
      // prepend comment
      var parentContent;
      $el.find('.comment').each(function () {
        var $this = $(this);
        if ($this.data('index') === parentIndex) {
          parentContent = $this.data('get-content')();
        }
      });
      var comment = {
        content: content,
        parentContent: parentContent,
        like: 0,
        index: commentIndex
      };
      var $comment = $Comment(postId, comment);
      $commentList.prepend($comment);
      $el.trigger('comment-posted');
    });
  });
  // load more
  $commentMore.click(function () {
    loadMore($el, $el.data('max-index'));
  });
}

function addCustomEventListener($el) {
  var $formContainer = $el.find('.comment-box__comment-form-container'),
      $formInput = $formContainer.find('.comment-box__comment-input');

  function showForm() {
    $formContainer.css('opacity', 1);
    $formInput.focus();
  }

  $(document).on('post-bottom-comment-clicked', function (evt, args) {
    var $postBottom = args.$el;
    $el.data('parent-index', -1);
    $formInput.attr('placeholder', '回复楼主');
    scrollTo($el, $postBottom);
    setTimeout(showForm, 0);  // show after 'onscroll', which will hide the form
  });

  $el.on('comment-clicked', function (evt, args) {
    var $comment = args.$el;
    $el.data('parent-index', $comment.data('index'));
    $formInput.attr('placeholder', '回复层主');
    scrollTo($el, $comment);
    setTimeout(showForm, 0);
  });

  $(document).scroll(function () {
    $formContainer.css('opacity', 0);
  });
}

function loadMore($el) {
  var postId = $el.data('post-id');
  service.getMoreComments(postId, $el.data('max-index'), function (comments, more) {
    pushComments($el, postId, comments, more);
  });
}

function pushComments($el, postId, comments, more) {
  var $commentContainer = $el.find('.comment-box__comment-container'),
      $commentList = $el.find('.comment-box__comment-list'),
      $commentMore = $el.find('.comment-box__comment-more');
  if (comments.length > 0) {
    $el.data('max-index', comments[comments.length - 1].index); 
  }
  if (comments.length > 0) $commentContainer.show();
  // append comments
  comments.forEach(function (comment) {
    var $comment = $Comment(postId, comment);
    $commentList.append($comment);
  });
  // show 'load more' if has more
  if (more) $commentMore.show();
  else $commentMore.hide();
}

function assignHotComments($el, hotComments) {
  var postId = $el.data('post-id');
    var $hotCommentContainer = $el.find('.comment-box__hot-comment-container'),
        $hotCommentList = $el.find('.comment-box__hot-comment-list');
    if (hotComments.length > 0) $hotCommentContainer.show();
    // append hot comments
    hotComments.forEach(function (hotComment) {
      var $hotComment = $Comment(postId, hotComment);
      $hotCommentList.append($hotComment);
    });
}

function scrollTo($el, $target) {
  var $formContainer = $el.find('.comment-box__comment-form-container'),
      formHeight = $formContainer.height(),
      screenHeight = $(window).height(),
      targetY = $target.offset().top,
      targetHeight = $target.height(),
      targetScrollTop = targetY + targetHeight,
      scrollTop = targetScrollTop - screenHeight + formHeight;
  $(document.body).scrollTop(scrollTop - 1);
}

function init(postId, hotComments, comments, more) {
  var $el = render(postId);
  initData($el, postId);
  addIntersaction($el);
  addCustomEventListener($el);
  assignHotComments($el, hotComments);
  pushComments($el, postId, comments, more);
  return $el;
}

module.exports = init;
