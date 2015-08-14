'use strict';

var path = require('path'),
    fs = require('fs'),
    app = require('../app');

// check if the filepath is potentially malicious
function isMalicious(filepath) {
    var ext = path.extname(filepath);
    return ext !== '.css' && ext !== '.js' || filepath.indexOf('../') !== -1;
}

module.exports = function (dir) {
    dir = dir || '/public/c';
    var root = app.get('root') + dir,
        logger = app.get('logger') || console,
        cache = {},
        lastHash;

    return function (req, res) {
        var i = req.originalUrl.indexOf('??'),
            j = req.originalUrl.indexOf('&'),
            contents = [],
            url, ext, hash, files, rs;

        // HACKING: ~(x) === (x !== -1)
        if (~i) {
            url = ~j ? req.originalUrl.slice(i + 2, j) : req.originalUrl.slice(i + 2);
            ext = path.extname(url);
            // set content type
            if (ext) res.type(ext.slice(1));
            if (~j) hash = req.originalUrl.slice(j + 1);
            if (hash !== lastHash) {
                lastHash = hash;
                cache = {};
            }

            // use a long cache for prod env, 0 for dev env
            res.setHeader('Cache-Control', 'public, max-age=' +
                (app.get('env') === 'production' ? 60 * 60 * 24 * 365 : 0));

            files = url.split(',');
            files.forEach(function (file) {
                if (cache.hasOwnProperty(file)) return contents.push(cache[file]);
                if (isMalicious(file)) return logger.error('[combo] malicious file: ' + file);

                var filePath = path.resolve(root, file),
                    content;
                try {
                    content = fs.readFileSync(filePath, 'utf-8');
                } catch (e) {
                    logger.error('[combo] cannot read file: ' + filePath + '\n', e.stack);
                }
                if (content) contents.push(cache[file] = content);
            });

            rs = contents.join('\n');
            if (contents.length !== files.length) {
                logger.error('[combo] some files not found');
            }

            res.send(rs) ;
        } else {
            res.send('I am a combo service :)');
        }
    };
};
