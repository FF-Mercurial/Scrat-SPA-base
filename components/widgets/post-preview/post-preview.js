'use strict';

var $PostBottom = require('widgets/post-bottom'),
    postPreviewTpl = Handlebars.compile(__inline('./post-preview.html'));

function trim(str) {
  return str.replace(/^\s*/g, '').replace(/\s*$/, '');
}

var REGEX_IMG = /<img .*?src="(.*?)".*?>/;
function getPreview(content) {
  var img = content.match(REGEX_IMG)[1],
      text = trim($.fromHtml(content).text());
  return {
    img: img,
    text: text
  };
}

function render(post) {
  post.preview = getPreview(post.content);
  var html = postPreviewTpl({ post: post }),
      $el = $.fromHtml1(html),
      $postBottom = $PostBottom(post);
  $postBottom.insertAt($el.find('.include__post-bottom'));
  return $el;
}

function addIntersaction($el) {
  var $preview = $el.find('.post-preview__preview'),
      postId = $el.data('post-id');
  function gotoDetail() {
    page('/p/detail/' + postId);
  }
  $preview.click(gotoDetail);
  $el.on('post-bottom-comment-clicked', gotoDetail);
}

function init(post) {
  var $el = render(post);
  $el.data('post-id', post.id);
  addIntersaction($el);
  return $el;
}

module.exports = init;
