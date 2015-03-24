Package.describe({
  name: 'glasser:reactive-fromnow',
  version: '0.0.1',
  summary: 'Reactively display fromNow() from moment.js',
  git: 'https://github.com/glasser/reactive-fromnow',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');
  api.use('momentjs:moment@2.9.0');
  api.use('tracker');
  api.addFiles('reactive-fromnow.js', 'client');
  api.export('ReactiveFromNow', 'client');
  api.export('ReactiveFromNowTest', 'client', { testOnly: true });
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('glasser:reactive-fromnow');
  api.use('tracker');
  api.use('momentjs:moment');
  api.addFiles('reactive-fromnow-tests.js', 'client');
});
