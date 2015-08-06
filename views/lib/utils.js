/**
 * Zepto extensions
 */

$.fromHtml = function (html) {
  var $buf = $('<div>').html(html);
  $buf.find('*').removeAttr('onload');  // remove onload event on attrs
  return $buf;
};

$.fromHtml1 = function (html) {
  return $.fromHtml(html).children().first();
};

$.fn.insertAt = function ($target) {
  this.insertBefore($target);
  $target.remove();
};

$.fn.assign = function ($content) {
  this.children().detach();
  this.append($content);
};

$.fn.data = function (key, value) {
  // get
  if (typeof value === 'undefined') {
    return this[0].data && this[0].data[key];
  // set
  } else {
    if (typeof this[0].data === 'undefined') {
      this[0].data = {}
    };
    this[0].data[key] = value;
  }
};

$.fn.scrollTop = function (value) {
  if (typeof value === 'undefined') return this[0].scrollTop;  // get
  else this[0].scrollTop = value;  // set
}
