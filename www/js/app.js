(function () {
  'use strict';

  var Controllers = require('./controllers');
  var Services = require('./services');
  var Config = require('./config');
  var Utils = require('./utils');

  angular
    .module('bibleInOneYear', [
      'ionic', 
      Controllers, 
      Services,
      Config, 
      Utils
    ]);
})();
