'use strict';

var $PostPreview = require('widgets/post-preview'),
    postListTpl = Handlebars.compile(__inline('./post-list.html'));

function render() {
  var html = postListTpl(),
      $el = $.fromHtml1(html);
  return $el;
}

function addInterface($el) {
  $el.data('pushBack', function (posts) {
    posts.forEach(function (post) {
      var $postPreview = $PostPreview(post);
      $el.append($postPreview);
    });
  });
  $el.data('assign', function (posts) {
    $el.empty();
    posts.forEach(function (post) {
      var $postPreview = $PostPreview(post);
      $el.append($postPreview);
    });
  });
}

function addEventListener($el) {
  // on drag at top
  (function () {
    var $body = $(document.body),
        flag,
        startFrom,
        endAt;
    $el.on('touchstart', function (e) {
      flag = $body.scrollTop() === 0;
      startFrom = e.touches[0].clientY;
    });
    $el.on('touchmove', function (e) {
      endAt = e.touches[0].clientY;
    });
    $el.on('touchend touchcancel', function () {
      var offset = endAt - startFrom;
      if (offset > 0 && flag) $el.trigger('post-list-drag-at-top');
    });
  })();
  // on drag at bottom
  (function () {
    var $body = $(document.body),
        flag,
        startFrom,
        endAt;
    $el.on('touchstart', function (e) {
      flag = $body.scrollTop() + window.screen.height >= $body.height();
      startFrom = e.touches[0].clientY;
    });
    $el.on('touchmove', function (e) {
      endAt = e.touches[0].clientY;
    });
    $el.on('touchend touchcancel', function () {
      var offset = endAt - startFrom;
      if (offset < 0 && flag) $el.trigger('post-list-drag-at-bottom');
    });
  })();
}
  
function init() {
  var $el = render();
  addInterface($el);
  addEventListener($el);
  return $el;
}

module.exports = init;
