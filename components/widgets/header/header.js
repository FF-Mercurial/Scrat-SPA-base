'use strict';

var headerTpl = Handlebars.compile(__inline('./header.html'));

function render() {
  var html = headerTpl(),
      $el = $.fromHtml1(html);
  return $el;
}

function checkTab($el, tab) {
  $el.find('[href="/p/' + tab + '"]').addClass('common-checked');
}

function init(tab) {
  var $el = render();
  checkTab($el, tab);
  return $el;
}

module.exports = init;
