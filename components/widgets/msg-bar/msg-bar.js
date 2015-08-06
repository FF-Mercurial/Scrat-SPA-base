'use strict';

var msgBarTpl = Handlebars.compile(__inline('./msg-bar.html'));

function show($container, msg) {
  var $msgBar = $container.find('.msg-bar');
  if ($msgBar.length === 0) {
    var html = msgBarTpl();
    $msgBar = $.fromHtml1(html);
    $container.append($msgBar);
  }
  $msgBar.text(msg);
  $msgBar.css('opacity', 0.5);
  setTimeout(function () {
    $msgBar.css('opacity', 0);
  }, 1000);
}

module.exports = {
  show: show
};
