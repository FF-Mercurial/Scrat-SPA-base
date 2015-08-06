'use strict';

var $PostList = require('widgets/post-list'),
    framework = require('widgets/framework'),
    msgBar = require('widgets/msg-bar'),
    service = require('lib/service');

function initData($el) {
  $el.data('loading', false);
  $el.data('max-id', -1);
}

function render() {
  var $postList = $PostList(),
      $el = framework.init($postList, 'latest');
  $el.data('$postList', $postList);
  return $el;
}

function addEventListener($el) {
  $el.on('post-list-drag-at-top', function () {
    reset($el);
  });
  $el.on('post-list-drag-at-bottom', function () {
    loadMore($el);
  });
}

function reset($el) {
  var $postList = $el.data('$postList');
  $postList.empty();
  initData($el);
  loadMore($el, function () {
    msgBar.show($postList, '已更新到最新');
  });
}

function init() {
  var $el = render();
  addEventListener($el);
  reset($el);
  return $el;
}

function loadMore($el, cb) {
  if ($el.data('loading')) return;
  $el.data('loading', true);
  service.getMorePosts($el.data('max-id'), function (posts) {
    $el.data('loading', false);
    $el.data('max-id', posts[posts.length - 1].id);
    $el.data('$postList').data('pushBack')(posts);
    if (cb) cb();
  });
}

module.exports = init;
