'use strict';

var $Header = require('widgets/header'),
    frameworkTpl = Handlebars.compile(__inline('./framework.html'));

function init($pageContent, tab) {
  var html = frameworkTpl(),
      $el = $.fromHtml1(html),
      $header = $Header(tab),
      $content = $el.find('.framework__content');
  $header.insertAt($el.find('.include__header'));
  $content.append($pageContent);
  return $el;
}

module.exports = {
  init: init
};
