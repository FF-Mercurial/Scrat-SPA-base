var meta = require('./package.json');
fis.config.set('name', meta.name);
fis.config.set('version', meta.version);
fis.config.set('project.exclude', 'node_modules/**');
fis.config.set('framework', {
    cache: true,
    urlPattern: '/c/%s',
    comboPattern: '/co??%s'
});
fis.config.set('settings.lint.jshint', {
  ignored: [ 'views/lib/**' ],
  // Enforcing options
  camelcase: true,
  eqeqeq: true,
  forin: true,
  freeze: true,
  predef: ['__inline', '__uri', 'page', 'define', 'Handlebars'],
  immed: true,
  indent: 2,
  newcap: true,
  noarg: true,
  noempty: true,
  nonew: true,
  quotmark: 'single',
  undef: true,
  unused: true,
  strict: true,
 
  // Environments
  browser: true,
  jquery: true,
  node: true
});
fis.config.set('settings.spriter.csssprites.margin', 4);
