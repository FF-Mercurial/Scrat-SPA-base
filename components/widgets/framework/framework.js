'use strict';

var $Header = require('widgets/header'),
    $GotoTop = require('widgets/goto-top'),
    frameworkTpl = Handlebars.compile(__inline('./framework.html'));

function init($pageContent, tab) {
  var html = frameworkTpl(),
      $el = $.fromHtml1(html),
      $header = $Header(tab),
      $gotoTop = $GotoTop(),
      $content = $el.find('.framework__content');
  $header.insertAt($el.find('.include__header'));
  $gotoTop.insertAt($el.find('.include__goto-top'));
  $content.append($pageContent);
  return $el;
}

module.exports = {
  init: init
};
