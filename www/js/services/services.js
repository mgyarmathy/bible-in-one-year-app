(function () {
  'use strict';

  var moment = require('moment');
  var _ = require('underscore');
  var ReadingPlan = require('bible-in-one-year');

  var app = angular.module('bibleInOneYear.services', []);

  app.factory('settingsService', settingsService);
  app.factory('readingPlanService', readingPlanService);

  function settingsService() {
    var loggedIn = false;
    var theme = "calm";

    activate();

    var service = {
      isLoggedIn: isLoggedIn,
      getTheme: getTheme,
      logIn: logIn,
      logOut: logOut,
      setTheme: setTheme
    };

    return service;

    ////////////

    function activate() {
      if (window.localStorage.getItem('LoggedIn') != null) {
        loggedIn = window.localStorage.getItem('LoggedIn');
      }
      if (window.localStorage.getItem('Theme') != null) {
        theme = window.localStorage.getItem('Theme');
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
      window.localStorage.setItem('LoggedIn', loggedIn);
    }

    function logOut() {
      loggedIn = false;
      window.localStorage.removeItem('LoggedIn');
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
      window.localStorage.setItem('Theme', theme);
    }
  }

  function readingPlanService() {
    var readingPlan = [];

    activate();

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

    function activate() {
      if (window.localStorage.getItem('ReadingPlan') != null) {
        readingPlan = JSON.parse(window.localStorage.getItem('ReadingPlan'));
      }
    }

    function createPlan(plan) {
      var rp = new ReadingPlan(plan || 'oldnew-testament');
      readingPlan = [];
      for (var i = 0; i < rp.length(); i++) {
        var day = moment().add(i, 'days').format('MMMM D, YYYY');
        readingPlan.push({dayNumber: i+1, date: day, scripture: rp.getDay(i), complete: false});
      }
      window.localStorage.setItem('ReadingPlan', JSON.stringify(readingPlan));
    }

    function deletePlan() {
      readingPlan = [];
      window.localStorage.removeItem('ReadingPlan');
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
      window.localStorage.setItem('ReadingPlan', JSON.stringify(readingPlan));
    }

    function save() {
      window.localStorage.setItem('ReadingPlan', JSON.stringify(readingPlan));
    }
  }
  
  module.exports = app.name;
})();