'use strict';

var gotoTopTpl = Handlebars.compile(__inline('./goto-top.html'));

function render() {
  var html = gotoTopTpl(),
      $el = $.fromHtml1(html);
  return $el;
}

function init() {
  var $el = render();
  $el.click(function () {
    $(document.body).scrollTop(0);
  });
  return $el;
}

module.exports = init;
