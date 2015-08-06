'use strict';

var postBottomTpl = Handlebars.compile(__inline('./post-bottom.html')),
    service = require('lib/service');

function render(post) {
  var html = postBottomTpl(post),
      $el = $.fromHtml1(html);
  return $el;
}

function addIntersaction($el) {
  var $comment = $el.find('.post-bottom__comment'),
      $like = $el.find('.post-bottom__like'),
      $dislike = $el.find('.post-bottom__dislike');

  // switch like/dislike
  function check(buttonName, checked) {
    var $button = $el.find('.post-bottom__' + buttonName),
        postId = $el.data('post-id');
    if (checked) $button.addClass('common-checked');
    else $button.removeClass('common-checked');
    if (buttonName === 'like') {
      service.incPostLike(postId, checked);
    } else {
      service.incPostDislike(postId, checked);
    }
    // update the num
    var $num = $button.find('.post-bottom__num'),
        res = parseInt($num.text()) + (checked ? 1 : -1);
    $num.text(res);
  }
  // like
  $like.click(function () {
    // toggling
    if ($like.hasClass('common-checked')) {
      check('like', false);
    } else {
      check('like', true);
      // uncheck another
      if ($dislike.hasClass('common-checked')) check('dislike', false);
    }
  });
  // dislike, like above
  $dislike.click(function () {
    if ($dislike.hasClass('common-checked')) {
      check('dislike', false);
    } else {
      check('dislike', true);
      if ($like.hasClass('common-checked')) check('like', false);
    }
  });
  $comment.click(function () {
    $el.trigger('post-bottom-comment-clicked', { $el: $el });
  });
}

function addCustomEventListener($el) {
  var $commentNum = $el.find('.post-bottom__comment').find('.post-bottom__num');
  $(document).on('comment-posted', function () {
    $commentNum.text(parseInt($commentNum.text()) + 1);
  });
}

function init(post) {
  var $el = render(post);
  $el.data('post-id', post.id);
  addIntersaction($el);
  addCustomEventListener($el);
  return $el;
}

module.exports = init;
