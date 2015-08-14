// gen cb with default action
module.exports = function (res, cb) {
  return function (err) {
    // default rejecting
    if (err) {
      console.log(err.stack);
      res.status(500).end();
    // default resolving
    } else if (!cb) {
      res.end();
    // call custom cb with no err passed
    } else {
      var args = [].slice.call(arguments, 1);
      cb.apply(null, args);
    }
  }
}
