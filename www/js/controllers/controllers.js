(function () {
  'use strict';

  var Services = require('../services');
  var IntroController = require('./intro.controller');
  var MainController = require('./main.controller');
  var TodayController = require('./today.controller');
  var ReadingPlanDayController = require('./reading-plan-day.controller');

  var app = angular.module('bibleInOneYear.controllers', [])
    .controller('IntroController', IntroController)
    .controller('MainController', MainController)
    .controller('TodayController', TodayController)
    .controller('ReadingPlanDayController', ReadingPlanDayController);

  module.exports = app.name;
})();