'use strict';

var $PostBottom = require('widgets/post-bottom'),
    postDetailTpl = Handlebars.compile(__inline('./post-detail.html'));

function initData($el, postId) {
  $el.data('post-id', postId);
}

function activateGif(html) {
  if (html.length === 0) return '';
  var $res = $.fromHtml(html);
  $res.find('img').each(function () {
    var $this = $(this);
    if ($this.attr('org_src')) {
      $this.attr('src', $this.attr('org_src'));
    }
  });
  return $res.html();
}

function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

function removeOnload(html) {
  return html.replace(/onload=".*?"/g, '');
}

function wrapText(html) {
  var $res = $.fromHtml(html);
  $res.contents().filter(function () {
    return this.nodeType === 3 && trim(this.nodeValue).length > 0;
  }).wrap('<span>');
  return $res.html();
}

function render(post) {
  post.content = activateGif(removeOnload(wrapText(post.content)));
  var html = postDetailTpl(post),
      $el = $.fromHtml1(html),
      $postBottom = $PostBottom(post);
  $postBottom.insertAt($el.find('.include__post-bottom'));
  return $el;
}

function init(post) {
  var $el = render(post);
  $el.on('post-bottom-comment-clicked', function () {
  });
  initData($el, post.id);
  return $el;
}

module.exports = init;
