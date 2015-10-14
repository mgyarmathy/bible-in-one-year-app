(function () {
  'use strict';

  var moment = require('moment');
  var _ = require('underscore');
  var ReadingPlan = require('bible-in-one-year');

  var app = angular.module('bibleInOneYear.services', []);

  app.factory('$localStorage', localStorageService);
  app.factory('settingsService', settingsService);
  app.factory('readingPlanService', readingPlanService);

  localStorageService.$inject = ['$window'];

  function localStorageService($window) {
    var service = {
      set: set,
      get: get,
      remove: remove
    };

    return service;

    ////////////

    function set(key, value) {
      return $window.localStorage.setItem(key, value);
    }

    function get(key) {
      return $window.localStorage.getItem(key);
    }

    function remove(key) {
      return $window.localStorage.removeItem(key);
    }
  }

  settingsService.$inject = ['$window', '$localStorage'];

  function settingsService($window, $localStorage) {
    var loggedIn = false;
    var theme = "calm";

    init();

    var service = {
      isLoggedIn: isLoggedIn,
      getTheme: getTheme,
      logIn: logIn,
      logOut: logOut,
      setTheme: setTheme
    };

    return service;

    ////////////

    function init() {
      if ($localStorage.get('LoggedIn') != null) {
        loggedIn = $localStorage.get('LoggedIn');
      }
      if ($localStorage.get('Theme') != null) {
        theme = $localStorage.get('Theme');
      }
    }

    function isLoggedIn() {
      return loggedIn;
    }

    function getTheme() {
      return theme;
    }

    function logIn() {
      loggedIn = true;
      $localStorage.set('LoggedIn', loggedIn);
    }

    function logOut() {
      loggedIn = false;
      $localStorage.remove('LoggedIn');
    }

    function setTheme(readingPlan) {
      switch (readingPlan) {
        case 'oldnew-testament':
          theme = 'calm';
          break;
        case 'mcheyne':
          theme = 'balanced';
          break;
        case 'chronological':
          theme = 'royal';
          break;
        case 'new-testament':
          theme = 'energized';
          break;
        default:
          break;
      }
      $localStorage.set('Theme', theme);
    }
  }

  readingPlanService.$inject = ['$localStorage'];

  function readingPlanService($localStorage) {
    var readingPlan = [];

    init();

    var service = {
      createPlan: createPlan,
      deletePlan: deletePlan,
      findByDate: findByDate,
      getDay: getDay,
      list: list,
      recalibrate: recalibrate,
      save: save,
    };

    return service;

    ////////////

    function init() {
      if ($localStorage.get('ReadingPlan') != null) {
        readingPlan = JSON.parse($localStorage.get('ReadingPlan'));
      }
    }

    function createPlan(plan) {
      var rp = new ReadingPlan(plan || 'oldnew-testament');
      readingPlan = [];
      for (var i = 0; i < rp.length(); i++) {
        var day = moment().add(i, 'days').format('MMMM D, YYYY');
        readingPlan.push({dayNumber: i+1, date: day, scripture: rp.getDay(i), complete: false});
      }
      $localStorage.set('ReadingPlan', JSON.stringify(readingPlan));
    }

    function deletePlan() {
      readingPlan = [];
      $localStorage.remove('ReadingPlan');
    }

    function findByDate(date) {
      return _.find(readingPlan, function(day) {return day.date == date});
    }

    function getDay(day) {
      if (day > readingPlan.length)
        return {};
      else
        return readingPlan[day-1];
    }

    function list() {
      return readingPlan;
    }

    function recalibrate() {
      // find first incomplete day
      var incomplete = 0;
      for (var i = 0; i < readingPlan.length; i++) {
        if (readingPlan[i].complete == false) {
          incomplete = i;
          break;
        }
      }
      // change the date of all of the following days
      for (var i = incomplete, j = 0; i < readingPlan.length; i++) {
        readingPlan[i].date = moment().add(j, 'days').format('MMMM D, YYYY');
        j++;
      }
      $localStorage.set('ReadingPlan', JSON.stringify(readingPlan));
    }

    function save() {
      $localStorage.set('ReadingPlan', JSON.stringify(readingPlan));
    }
  }
  
  module.exports = app.name;
})();