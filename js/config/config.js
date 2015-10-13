(function () {
  'use strict';

  var Services = require('../services/services.js');

  var app = angular.module('bibleInOneYear.config', ['ionic', Services]);

  app.config(routerConfig);
  app.config(ionicConfig);
  app.run(runConfig);

  routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('intro', {
        url: "/",
        templateUrl: "templates/intro.html",
        controller: "IntroCtrl as vm",
        onEnter: function($state, settingsService) {
          if (settingsService.isLoggedIn()) {
            $state.go('tabs.today');
          }
        }
      })
      .state('tabs', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html",
        controller: "MainCtrl as vm",
        onEnter: function($state, settingsService) {
          if (!settingsService.isLoggedIn()) {
            $state.go('intro');
          }
        }
      })
      .state('tabs.today', {
        url: "/today",
        views: {
          'today-tab': {
            templateUrl: "templates/reading-plan-day.html",
            controller: "TodayCtrl as vm"
          }
        }
      })
      .state('tabs.reading-plan', {
        url: "/reading-plan",
        views: {
          'reading-plan-tab': {
            templateUrl: "templates/reading-plan.html"
          }
        }
      })
      .state('tabs.reading-plan-day', {
        url: "/reading-plan-day/:day",
        views: {
          'reading-plan-tab': {
            templateUrl: "templates/reading-plan-day.html",
            controller: "ReadingPlanDayCtrl as vm"
          }
        }
      })
      .state('tabs.settings', {
        url: "/settings",
        views: {
          'settings-tab': {
            templateUrl: "templates/settings.html"
          }
        }
      })
      .state('tabs.about', {
        url: "/about",
        views: {
          'settings-tab': {
            templateUrl: "templates/about.html"
          }
        }
      });

     // $urlRouterProvider.otherwise("/tab/today");
     $urlRouterProvider.otherwise("/");
  };

  ionicConfig.$inject = ['$ionicConfigProvider'];

  function ionicConfig($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
  }

  runConfig.$inject = ['$ionicPlatform', '$ionicHistory', '$rootScope', '$location', '$state', 'settingsService'];

  function runConfig($ionicPlatform, $ionicHistory, $rootScope, $location, $state, settingsService) {

    $rootScope.state = $state;

    $rootScope.showBackButton = function() {
      var s = $state.current.name
      return (s == 'tabs.about');
    };

    $rootScope.goBack = function() {
      $ionicHistory.goBack();
    };

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

        var isLogin = toState.name === "intro";
        if(isLogin){
           return; // no need to redirect 
        }

        // now, redirect only not authenticated

        var isLoggedIn = settingsService.isLoggedIn();

        if(isLoggedIn === false) {
            e.preventDefault(); // stop current execution
            $state.go('intro'); // go to intro
        }
    });
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  }

  module.exports = app.name;
})();