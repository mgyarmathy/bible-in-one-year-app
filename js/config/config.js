(function () {
  'use strict';

  var routesConfig = require('./routes.config');
  var ionicConfig = require('./ionic.config');
  var runConfig = require('./run.config');

  var app = angular.module('bibleInOneYear.config', [])
    .config(routesConfig)
    .config(ionicConfig)
    .run(runConfig);

  module.exports = app.name;
})();