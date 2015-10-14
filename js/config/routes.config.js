(function () {
  'use strict';

  routesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routesConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('intro', {
        url: "/",
        templateUrl: "templates/intro.html",
        controller: "IntroController as vm",
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
        controller: "MainController as mainVm",
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
            controller: "TodayController as vm"
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
            controller: "ReadingPlanDayController as vm"
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

  module.exports = routesConfig;
})();