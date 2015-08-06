'use strict';

var $PostList = require('widgets/post-list'),
    framework = require('widgets/framework'),
    msgBar = require('widgets/msg-bar'),
    service = require('lib/service');

function initData($el) {
  $el.data('loading', false);
}

function render() {
  var $postList = $PostList(),
      $el = framework.init($postList, 'hot');
  $el.data('$postList', $postList);
  return $el;
}

function addEventListener($el) {
  var $postList = $el.data('$postList');
  $el.on('post-list-drag-at-bottom', function () {
    load($el, function () {
      msgBar.show($postList, '换了一波');
    });
  });
  $el.on('post-list-drag-at-top', function () {
    load($el, function () {
      msgBar.show($postList, '换了一波');
    });
  });
}

function init() {
  var $el = render();
  addEventListener($el);
  initData($el);
  load($el);
  return $el;
}

function load($el, cb) {
  if ($el.data('loading')) return;
  $el.data('loading', true);
  service.getHotPosts(function (posts) {
    $(document.body).scrollTop(0);
    $el.data('loading', false);
    $el.data('$postList').data('assign')(posts);
    if (cb) cb();
  });
}

module.exports = init;
