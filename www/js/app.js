(function () {
  'use strict';

  var Controllers = require('./controllers/controllers.js');
  var Services = require('./services/services.js');
  var Config = require('./config/config.js');
  var Utils = require('./utils/utils.js');

  angular
    .module('bibleInOneYear', [
      'ionic', 
      Controllers, 
      Services,
      Config, 
      Utils
    ]);
})();
