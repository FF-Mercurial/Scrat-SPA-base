'use strict';

var cluster = require('cluster'),
    os = require('os'),
    cpuCount = os.cpus().length,
    app = require('../app'),
    logger = app.get('logger');

if (cluster.isMaster) {
    for (var i = 0; i < cpuCount; i++) cluster.fork();
    cluster.on('exit', function (worker) {
        logger.error('Worker ' + worker.id + 'died :(');
        cluster.fork();
    });
} else {
    app.listen(app.get('port'), function () {
        console.log('[%s] Express server listening on port %d',
            app.get('env').toUpperCase(), app.get('port'));
    });
}
