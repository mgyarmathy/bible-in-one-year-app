// Ionic Starter App

var _ = require('underscore');
var moment = require('moment');
var ReadingPlan = require('bible-in-one-year');

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bibleInOneYear', ['ionic'])

.factory('SettingsService', function() {
  var loggedIn = false;
  if (window.localStorage.getItem('LoggedIn') != null) {
    loggedIn = window.localStorage.getItem('LoggedIn');
  }

  return {
    logIn: function() {
      loggedIn = true;
      window.localStorage.setItem('LoggedIn', loggedIn);
    },
    logOut: function() {
      loggedIn = false;
      window.localStorage.removeItem('LoggedIn');
    },
    isLoggedIn: function() {
      return loggedIn;
    }
  }
})

.factory('ReadingPlanService', function() {
  var readingPlan = [];
  if (window.localStorage.getItem('ReadingPlan') != null) {
    readingPlan = JSON.parse(window.localStorage.getItem('ReadingPlan'));
  }

  return {
    createPlan: function(plan) {
      var rp = new ReadingPlan(plan || 'oldnew-testament');
      readingPlan = [];
      for(var i = 0; i<rp.length(); i++) {
        var day = moment().add(i, 'days').format('MMMM D, YYYY');
        readingPlan.push({dayNumber: i+1, date: day, scripture: rp.getDay(i), complete: false});
      }
      window.localStorage.setItem('ReadingPlan', JSON.stringify(readingPlan));
    },
    save: function() {
      window.localStorage.setItem('ReadingPlan', JSON.stringify(readingPlan));
    },
    delete: function() {
      readingPlan = [];
      window.localStorage.removeItem('ReadingPlan');
    },
    list: function() {
      return readingPlan;
    },
    getDay: function(day) {
      if (day > readingPlan.length)
        return {};
      else
        return readingPlan[day-1];
    },
    findByDate: function(date) {
      return _.find(readingPlan, function(day) {return day.date == date});
    }
  }
})

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, ReadingPlanService, SettingsService) {
  $scope.slideIndex = 0;

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };

  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  $scope.startPlan = function(planName) {
    SettingsService.logIn();
    ReadingPlanService.createPlan(planName);
    $state.go('tabs.today');
  };
})

.controller('MainCtrl', function($scope, $state, $ionicPopup, ReadingPlanService, SettingsService) {
  $scope.readingPlan = ReadingPlanService.list();

  $scope.$watch(ReadingPlanService.list, function() {
    $scope.readingPlan = ReadingPlanService.list();
  });

  $scope.createPlan = function() {
    ReadingPlanService.createPlan();
  };

  $scope.clearProgress = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Clear Progress',
      subTitle: 'You cannot undo this operation.',
      template: 'Are you sure you want to delete your progress? ',
      okText: 'Delete',
      okType: 'button-assertive'
    });
    confirmPopup.then(function(res) {
      if(res) {
        ReadingPlanService.delete();
        SettingsService.logOut();
        $state.go('intro');
      } else {
        console.log('You are not sure');
      }
    });
  };
})

.controller('TodayCtrl', function($scope, $state, ReadingPlanService) {
  $scope.day = ReadingPlanService.findByDate(moment().format('MMMM D, YYYY'));

  $scope.$watch(ReadingPlanService.list, function() {
    $scope.day = ReadingPlanService.findByDate(moment().format('MMMM D, YYYY'));
  });

  $scope.toggleComplete = function() {
    $scope.day.complete = !$scope.day.complete;
    ReadingPlanService.save();
    // $state.go('tabs.reading-plan');
  };
})

.controller('ReadingPlanDayCtrl', function($scope, $state, $stateParams, ReadingPlanService) {

  $scope.day = ReadingPlanService.getDay($stateParams.day);

  $scope.$watch(ReadingPlanService.list, function() {
    $scope.day = ReadingPlanService.getDay($stateParams.day);
  });

  $scope.toggleComplete = function() {
    $scope.day.complete = !$scope.day.complete;
    ReadingPlanService.save();
    // $state.go('tabs.reading-plan');
  };
})

.filter("stringReplace", [ function(){
  return function(str, pattern, replacement, global){
    global = (typeof global == 'undefined' ? true : global);
    try {
      return (str || '').replace(new RegExp(pattern,global ? "g": ""),function(match, group) {
        return replacement;
      });  
    } catch(e) {
      console.error("error in string.replace", e);
      return (str || '');
    }     
  } 
}])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('intro', {
      url: "/",
      templateUrl: "templates/intro.html",
      controller: 'IntroCtrl',
      onEnter: function($state, SettingsService) {
        if (SettingsService.isLoggedIn()) {
          $state.go('tabs.today');
        }
      }
    })
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
      controller: 'MainCtrl',
      onEnter: function($state, SettingsService) {
        if (!SettingsService.isLoggedIn()) {
          $state.go('intro');
        }
      }
    })
    .state('tabs.today', {
      url: "/today",
      views: {
        'today-tab': {
          templateUrl: "templates/today.html",
          controller: "TodayCtrl"
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
          controller: "ReadingPlanDayCtrl"
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
})

.config(['$ionicConfigProvider', function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom'); // other values: top
}])

.run(function($ionicPlatform, $ionicHistory, $rootScope, $location, $state, SettingsService) {

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

      var isLoggedIn = SettingsService.isLoggedIn();

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
});
