(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./config":2,"./controllers":6,"./services":11,"./utils":12}],2:[function(require,module,exports){
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
},{"./ionic.config":3,"./routes.config":4,"./run.config":5}],3:[function(require,module,exports){
(function () {
  'use strict';

  ionicConfig.$inject = ['$ionicConfigProvider'];

  function ionicConfig($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
  }

  module.exports = ionicConfig;
})();
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
(function () {
  'use strict';

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

  module.exports = runConfig;
})();
},{}],6:[function(require,module,exports){
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
},{"../services":11,"./intro.controller":7,"./main.controller":8,"./reading-plan-day.controller":9,"./today.controller":10}],7:[function(require,module,exports){
(function() {
  'use strict';

  var moment = require('moment');

  IntroController.$inject = ['$state', '$ionicSlideBoxDelegate', 'readingPlanService', 'settingsService'];

  function IntroController($state, $ionicSlideBoxDelegate, readingPlanService, settingsService) {
    var vm = this;

    vm.currentDay = moment().format('MMMM, D, YYYY');
    vm.dayComplete = false;
    vm.next = next;
    vm.previous = previous; 
    vm.range = range; 
    vm.slideChanged = slideChanged; 
    vm.slideIndex = 0;
    vm.startPlan = startPlan; 
    vm.toggleComplete = toggleComplete; 

    function next() {
      $ionicSlideBoxDelegate.next();
    }

    function previous() {
      $ionicSlideBoxDelegate.previous();
    }

    function range(n) {
      return new Array(n);
    }

    function slideChanged(index) {
      vm.slideIndex = index;
    }

    function startPlan(planName) {
      settingsService.logIn();
      settingsService.setTheme(planName);
      readingPlanService.createPlan(planName);
      $state.go('tabs.today');
    }

    function toggleComplete($event) {
      vm.dayComplete = !vm.dayComplete;
      var elem = $event.currentTarget;
      elem.classList.add('animated','pulse');
      setTimeout(function() {
        elem.classList.remove('animated', 'pulse');
      }, 500);
    }
  }

  module.exports = IntroController;
})();
},{"moment":18}],8:[function(require,module,exports){
(function() {
  'use strict';

  MainController.$inject = ['$scope', '$state', '$ionicPopup', '$ionicHistory', 'readingPlanService', 'settingsService'];

  function MainController($scope, $state, $ionicPopup, $ionicHistory, readingPlanService, settingsService) {
    var mainVm = this;

    mainVm.clearProgress = clearProgress;
    mainVm.readingPlan = readingPlanService.list();
    mainVm.recalibrateDates = recalibrateDates;
    mainVm.theme = settingsService.getTheme();

    $scope.$watch(readingPlanService.list, function() {
      mainVm.readingPlan = readingPlanService.list();
    });

    $scope.$watch(settingsService.getTheme, function() {
      mainVm.theme = settingsService.getTheme();
    });

    function clearProgress() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Clear Progress',
        subTitle: 'You cannot undo this operation.',
        template: 'Are you sure you want to delete your progress? ',
        okText: 'Delete',
        okType: 'button-assertive'
      });
      confirmPopup.then(function(res) {
        if(res) {
          readingPlanService.deletePlan();
          settingsService.logOut();
          $state.go('intro');
        } else {
          console.log('You are not sure');
        }
      });
    }

    function recalibrateDates() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Recalibrate Reading Plan',
        subTitle: 'Are you behind on your reading plan?',
        template: 'Click OK to recalibrate the dates of your reading plan.',
      });
      confirmPopup.then(function(res) {
        if(res) {
          readingPlanService.recalibrate();
          $ionicHistory.clearHistory()
          $state.go('tabs.reading-plan');
        } else {
          console.log('You are not sure');
        }
      });
    }
  }

  module.exports = MainController;
})();
},{}],9:[function(require,module,exports){
(function() {
  'use strict';

  ReadingPlanDayController.$inject = ['$scope', '$state', '$stateParams', 'readingPlanService'];

  function ReadingPlanDayController($scope, $state, $stateParams, readingPlanService) {
    var vm = this;

    vm.day = readingPlanService.getDay($stateParams.day);
    vm.toggleComplete = toggleComplete;

    $scope.$watch(readingPlanService.list, function() {
      vm.day = readingPlanService.getDay($stateParams.day);
    });

    function toggleComplete($event) {
      vm.day.complete = !vm.day.complete;
      var elem = $event.currentTarget;
      elem.classList.add('animated','pulse');
      setTimeout(function() {
        elem.classList.remove('animated', 'pulse');
      }, 500);
      readingPlanService.save();
    }
  }

  module.exports = ReadingPlanDayController;
})();
},{}],10:[function(require,module,exports){
(function() {
  'use strict';

  var moment = require('moment');

  TodayController.$inject = ['$scope', '$state', '$timeout', 'readingPlanService'];

  function TodayController($scope, $state, $timeout, readingPlanService) {
    var vm = this;

    vm.day = readingPlanService.findByDate(moment().format('MMMM D, YYYY'));
    vm.doRefresh = doRefresh;
    vm.toggleComplete = toggleComplete;

    $scope.$watch(readingPlanService.list, function() {
      vm.day = readingPlanService.findByDate(moment().format('MMMM D, YYYY'));
    });

    function doRefresh() {
      $timeout( function() {
        vm.day = readingPlanService.findByDate(moment().format('MMMM D, YYYY'));
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    }

    function toggleComplete($event) {
      vm.day.complete = !vm.day.complete;
      var elem = $event.currentTarget;
      elem.classList.add('animated','pulse');
      setTimeout(function() {
        elem.classList.remove('animated', 'pulse');
      }, 500);
      readingPlanService.save();
    }
  }

  module.exports = TodayController;
})();
},{"moment":18}],11:[function(require,module,exports){
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
},{"bible-in-one-year":13,"moment":18,"underscore":19}],12:[function(require,module,exports){
(function () {
  'use strict';

  var app = angular.module('bibleInOneYear.utils', []);

  app.filter("stringReplace", stringReplace);

  function stringReplace() {
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
  }

  module.exports = app.name;
})();
},{}],13:[function(require,module,exports){
var oldnewtestament = require("./lib/oldnew-testament.json");
var mcheyne = require("./lib/mcheyne.json");
var chronological = require("./lib/chronological.json");
var newtestament = require("./lib/new-testament.json");

var ReadingPlan = function(reading_plan) {
    var entries;

    switch (reading_plan) {
        case 'oldnew-testament':
            entries = oldnewtestament;
            break;
        case 'mcheyne':
            entries = mcheyne;
            break;
        case 'chronological':
            entries = chronological;
            break;
        case 'new-testament':
            entries = newtestament;
            break;
        default:
            entries = oldnewtestament;
            break;
    }

    this.length = function() {
        return entries.length;
    };

    this.getDay = function(index) {
        var index = index % this.length();
        return entries[index]; 
    }
};

module.exports = ReadingPlan;
},{"./lib/chronological.json":14,"./lib/mcheyne.json":15,"./lib/new-testament.json":16,"./lib/oldnew-testament.json":17}],14:[function(require,module,exports){
module.exports=["Genesis 1-3","Genesis 4-7","Genesis 8-11","Job 1-5","Job 6-9","Job 10-13","Job 14-16","Job 17-20","Job 21-23","Job 24-28","Job 29-31","Job 32-34","Job 35-37","Job 38-39","Job 40-42","Genesis 12-15","Genesis 16-18","Genesis 19-21","Genesis 22-24","Genesis 25-26","Genesis 27-29","Genesis 30-31","Genesis 32-34","Genesis 35-37","Genesis 38-40","Genesis 41-42","Genesis 43-45","Genesis 46-47","Genesis 48-50","Exodus 1-3","Exodus 4-6","Exodus 7-9","Exodus 10-12","Exodus 13-15","Exodus 16-18","Exodus 19-21","Exodus 22-24","Exodus 25-27","Exodus 28-29","Exodus 30-32","Exodus 33-35","Exodus 36-38","Exodus 39-40","Leviticus 1-4","Leviticus 5-7","Leviticus 8-10","Leviticus 11-13","Leviticus 14-15","Leviticus 16-18","Leviticus 19-21","Leviticus 22-23","Leviticus 24-25","Leviticus 26-27","Numbers 1-2","Numbers 3-4","Numbers 5-6","Numbers 7","Numbers 8-10","Numbers 11-13","Numbers 14-15, Psalm 90","Numbers 16-17","Numbers 18-20","Numbers 21-22","Numbers 23-25","Numbers 26-27","Numbers 28-30","Numbers 31-32","Numbers 33-34","Numbers 35-36","Deuteronomy 1-2","Deuteronomy 3-4","Deuteronomy 5-7","Deuteronomy 8-10","Deuteronomy 11-13","Deuteronomy 14-16","Deuteronomy 17-20","Deuteronomy 21-23","Deuteronomy 24-27","Deuteronomy 28-29","Deuteronomy 30-31","Deuteronomy 32-34, Psalm 91","Joshua 1-4","Joshua 5-8","Joshua 9-11","Joshua 12-15","Joshua 16-18","Joshua 19-21","Joshua 22-24","Judges 1-2","Judges 3-5","Judges 6-7","Judges 8-9","Judges 10-12","Judges 13-15","Judges 16-18","Judges 19-21","Ruth 1-4","1 Samuel 1-3","1 Samuel 4-8","1 Samuel 9-12","1 Samuel 13-14","1 Samuel 15-17","1 Samuel 18-20, Psalm 11, Psalm 59","1 Samuel 21-24","Psalm 7, Psalm 27, Psalm 31, Psalm 34, Psalm 52","Psalm 56, Psalm 120, Psalm 140-142","1 Samuel 25-27","Psalm 17, Psalm 35, Psalm 54, Psalm 63","1 Samuel 28-31, Psalm 18","Psalm 121, Psalm 123-125, Psalm 128-130","2 Samuel 1-4","Psalm 6, Psalm 8-10, Psalm 14, Psalm 16, Psalm 19, Psalm 21","1 Chronicles 1-2","Psalm 43-45, Psalm 49, Psalm 84-85, Psalm 87","1 Chronicles 3-5","Psalm 73, Psalm 77-78","1 Chronicles 6","Psalm 81, Psalm 88, Psalm 92-93","1 Chronicles 7-10","Psalm 102-104","2 Samuel 5:1-10, 1 Chronicles 11-12","Psalm 133","Psalm 106-107","2 Samuel 5:11-6:23, 1 Chronicles 13-16","Psalm 1-2, Psalm 15, Psalm 22-24, Psalm 47, Psalm 68","Psalm 89, Psalm 96, Psalm 100-101, Psalm 105, Psalm 132","2 Samuel 7, 1 Chronicles 17","Psalm 25, Psalm 29, Psalm 33, Psalm 36, Psalm 39","2 Samuel 8-9, 1 Chronicles 18","Psalm 50, Psalm 53, Psalm 60, Psalm 75","2 Samuel 10, 1 Chronicles 19, Psalm 20","Psalm 65-67, Psalm 69-70","2 Samuel 11-12, 1 Chronicles 20","Psalm 32, Psalm 51, Psalm 86, Psalm 122","2 Samuel 13-15","Psalm 3-4, Psalm 12-13, Psalm 28, Psalm 55","2 Samuel 16-18","Psalm 26, Psalm 40, Psalm 58, Psalm 61-62, Psalm 64","2 Samuel 19-21","Psalm 5, Psalm 38, Psalm 41-42","2 Samuel 22-23, Psalm 57","Psalm 95, Psalm 97-99","2 Samuel 24, 1 Chronicles 21-22, Psalm 30","Psalm 108-110","1 Chronicles 23-25","Psalm 131, Psalm 138-139, Psalm 143-145","1 Chronicles 26-29, Psalm 127","Psalm 111-118","1 Kings 1-2, Psalm 37, Psalm 71, Psalm 94","Psalm 119:1-88","1 Kings 3-4, 2 Chronicles 1, Psalm 72","Psalm 119:89-176","Song of Solomon 1-8","Proverbs 1-3","Proverbs 4-6","Proverbs 7-9","Proverbs 10-12","Proverbs 13-15","Proverbs 16-18","Proverbs 19-21","Proverbs 22-24","1 Kings 5-6, 2 Chronicles 2-3","1 Kings 7, 2 Chronicles 4","1 Kings 8, 2 Chronicles 5","2 Chronicles 6-7, Psalm 136","Psalm 134, Psalm 146-150","1 Kings 9, 2 Chronicles 8","Proverbs 25-26","Proverbs 27-29","Ecclesiastes 1-6","Ecclesiastes 7-12","1 Kings 10-11, 2 Chronicles 9","Proverbs 30-31","1 Kings 12-14","2 Chronicles 10-12","1 Kings 15:1-24, 2 Chronicles 13-16","1 Kings 15:25-16:34, 2 Chronicles 17","1 Kings 17-19","1 Kings 20-21","1 Kings 22, 2 Chronicles 18","2 Chronicles 19-23","Obadiah 1, Psalm 82-83","2 Kings 1-4","2 Kings 5-8","2 Kings 9-11","2 Kings 12-13, 2 Chronicles 24","2 Kings 14, 2 Chronicles 25","Jonah 1-4","2 Kings 15, 2 Chronicles 26","Isaiah 1-4","Isaiah 5-8","Amos 1-5","Amos 6-9","2 Chronicles 27, Isaiah 9-12","Micah 1-7","2 Chronicles 28, 2 Kings 16-17","Isaiah 13-17","Isaiah 18-22","Isaiah 23-27","2 Kings 18:1-8, 2 Chronicles 29-31, Psalm 48","Hosea 1-7","Hosea 8-14","Isaiah 28-30","Isaiah 31-34","Isaiah 35-36","Isaiah 37-39, Psalm 76","Isaiah 40-43","Isaiah 44-48","2 Kings 18:9-19:37, Psalm 46, Psalm 80, Psalm 135","Isaiah 49-53","Isaiah 54-58","Isaiah 59-63","Isaiah 64-66","2 Kings 20-21","2 Chronicles 32-33","Nahum 1-3","2 Kings 22-23, 2 Chronicles 34-35","Zephaniah 1-3","Jeremiah 1-3","Jeremiah 4-6","Jeremiah 7-9","Jeremiah 10-13","Jeremiah 14-17","Jeremiah 18-22","Jeremiah 23-25","Jeremiah 26-29","Jeremiah 30-31","Jeremiah 32-34","Jeremiah 35-37","Jeremiah 38-40, Psalm 74, Psalm 79","2 Kings 24-25, 2 Chronicles 36","Habakkuk 1-3","Jeremiah 41-45","Jeremiah 46-48","Jeremiah 49-50","Jeremiah 51-52","Lamentations 1:1-3:36","Lamentations 3:37-5:22","Ezekiel 1-4","Ezekiel 5-8","Ezekiel 9-12","Ezekiel 13-15","Ezekiel 16-17","Ezekiel 18-19","Ezekiel 20-21","Ezekiel 22-23","Ezekiel 24-27","Ezekiel 28-31","Ezekiel 32-34","Ezekiel 35-37","Ezekiel 38-39","Ezekiel 40-41","Ezekiel 42-43","Ezekiel 44-45","Ezekiel 46-48","Joel 1-3","Daniel 1-3","Daniel 4-6","Daniel 7-9","Daniel 10-12","Ezra 1-3","Ezra 4-6, Psalm 137","Haggai 1-2","Zechariah 1-7","Zechariah 8-14","Esther 1-5","Esther 6-10","Ezra 7-10","Nehemiah 1-5","Nehemiah 6-7","Nehemiah 8-10","Nehemiah 11-13, Psalm 126","Malachi 1-4","Luke 1, John 1:1-14","Matthew 1, Luke 2:1-38","Matthew 2, Luke 2:39-52","Matthew 3, Mark 1, Luke 3","Matthew 4, Luke 4-5, John 1:15-51","John 2-4","Mark 2","John 5","Matthew 12:1-21, Mark 3, Luke 6","Matthew 5-7","Matthew 8:1-13, Luke 7","Matthew 11","Matthew 12:22-50, Luke 11","Matthew 13, Luke 8","Matthew 8:14-34, Mark 4-5","Matthew 9-10","Matthew 14, Mark 6, Luke 9:1-17","John 6","Matthew 15, Mark 7","Matthew 16, Mark 8, Luke 9:18-27","Matthew 17, Mark 9, Luke 9:28-62","Matthew 18","John 7-8","John 9:1-10:21","Luke 10-11, John 10:22-42","Luke 12-13","Luke 14-15","Luke 16-17:10","John 11","Luke 17:11-18:14","Matthew 19, Mark 10","Matthew 20-21","Luke 18:15-19:48","Mark 11, John 12","Matthew 22, Mark 12","Matthew 23, Luke 20-21","Mark 13","Matthew 24","Matthew 25","Matthew 26, Mark 14","Luke 22, John 13","John 14-17","Matthew 27, Mark 15","Luke 23, John 18-19","Matthew 28, Mark 16","Luke 24, John 20-21","Acts 1-3","Acts 4-6","Acts 7-8","Acts 9-10","Acts 11-12","Acts 13-14","James 1-5","Acts 15-16","Galatians 1-3","Galatians 4-6","Acts 17-18:18","1 Thessalonians 1-5, 2 Thessalonians 1-3","Acts 18:19-19:41","1 Corinthians 1-4","1 Corinthians 5-8","1 Corinthians 9-11","1 Corinthians 12-14","1 Corinthians 15-16","2 Corinthians 1-4","2 Corinthians 5-9","2 Corinthians 10-13","Acts 20:1-3, Romans 1-3","Romans 4-7","Romans 8-10","Romans 11-13","Romans 14-16","Acts 20:4-23:35","Acts 24-26","Acts 27-28","Colossians 1-4, Philemon 1","Ephesians 1-6","Philippians 1-4","1 Timothy 1-6","Titus 1-3","1 Peter 1-5","Hebrews 1-6","Hebrews 7-10","Hebrews 11-13","2 Timothy 1-4","2 Peter 1-3, Jude 1","1 John 1-5","2 John 1, 3 John 1","Revelation 1-5","Revelation 6-11","Revelation 12-18","Revelation 19-22"]

},{}],15:[function(require,module,exports){
module.exports=["Genesis 1, Matthew 1, Ezra 1, Acts 1","Genesis 2, Matthew 2, Ezra 2, Acts 2","Genesis 3, Matthew 3, Ezra 3, Acts 3","Genesis 4, Matthew 4, Ezra 4, Acts 4","Genesis 5, Matthew 5, Ezra 5, Acts 5","Genesis 6, Matthew 6, Ezra 6, Acts 6","Genesis 7, Matthew 7, Ezra 7, Acts 7","Genesis 8, Matthew 8, Ezra 8, Acts 8","Genesis 9–10, Matthew 9, Ezra 9, Acts 9","Genesis 11, Matthew 10, Ezra 10, Acts 10","Genesis 12, Matthew 11, Nehemiah 1, Acts 11","Genesis 13, Matthew 12, Nehemiah 2, Acts 12","Genesis 14, Matthew 13, Nehemiah 3, Acts 13","Genesis 15, Matthew 14, Nehemiah 4, Acts 14","Genesis 16, Matthew 15, Nehemiah 5, Acts 15","Genesis 17, Matthew 16, Nehemiah 6, Acts 16","Genesis 18, Matthew 17, Nehemiah 7, Acts 17","Genesis 19, Matthew 18, Nehemiah 8, Acts 18","Genesis 20, Matthew 19, Nehemiah 9, Acts 19","Genesis 21, Matthew 20, Nehemiah 10, Acts 20","Genesis 22, Matthew 21, Nehemiah 11, Acts 21","Genesis 23, Matthew 22, Nehemiah 12, Acts 22","Genesis 24, Matthew 23, Nehemiah 13, Acts 23","Genesis 25, Matthew 24, Esther 1, Acts 24","Genesis 26, Matthew 25, Esther 2, Acts 25","Genesis 27, Matthew 26, Esther 3, Acts 26","Genesis 28, Matthew 27, Esther 4, Acts 27","Genesis 29, Matthew 28, Esther 5, Acts 28","Genesis 30, Mark 1, Esther 6, Romans 1","Genesis 31, Mark 2, Esther 7, Romans 2","Genesis 32, Mark 3, Esther 8, Romans 3","Genesis 33, Mark 4, Esther 9–10, Romans 4","Genesis 34, Mark 5, Job 1, Romans 5","Genesis 35–36, Mark 6, Job 2, Romans 6","Genesis 37, Mark 7, Job 3, Romans 7","Genesis 38, Mark 8, Job 4, Romans 8","Genesis 39, Mark 9, Job 5, Romans 9","Genesis 40, Mark 10, Job 6, Romans 10","Genesis 41, Mark 11, Job 7, Romans 11","Genesis 42, Mark 12, Job 8, Romans 12","Genesis 43, Mark 13, Job 9, Romans 13","Genesis 44, Mark 14, Job 10, Romans 14","Genesis 45, Mark 15, Job 11, Romans 15","Genesis 46, Mark 16, Job 12, Romans 16","Genesis 47, Luke 1:1–38, Job 13, 1 Corinthians 1","Genesis 48, Luke 1:39–80, Job 14, 1 Corinthians 2","Genesis 49, Luke 2, Job 15, 1 Corinthians 3","Genesis 50, Luke 3, Job 16–17, 1 Corinthians 4","Exodus 1, Luke 4, Job 18, 1 Corinthians 5","Exodus 2, Luke 5, Job 19, 1 Corinthians 6","Exodus 3, Luke 6, Job 20, 1 Corinthians 7","Exodus 4, Luke 7, Job 21, 1 Corinthians 8","Exodus 5, Luke 8, Job 22, 1 Corinthians 9","Exodus 6, Luke 9, Job 23, 1 Corinthians 10","Exodus 7, Luke 10, Job 24, 1 Corinthians 11","Exodus 8, Luke 11, Job 25–26, 1 Corinthians 12","Exodus 9, Luke 12, Job 27, 1 Corinthians 13","Exodus 10, Luke 13, Job 28, 1 Corinthians 14","Exodus 11–12:21, Luke 14, Job 29, 1 Corinthians 15","Exodus 12:22–51, Luke 15, Job 30, 1 Corinthians 16","Exodus 13, Luke 16, Job 31, 2 Corinthians 1","Exodus 14, Luke 17, Job 32, 2 Corinthians 2","Exodus 15, Luke 18, Job 33, 2 Corinthians 3","Exodus 16, Luke 19, Job 34, 2 Corinthians 4","Exodus 17, Luke 20, Job 35, 2 Corinthians 5","Exodus 18, Luke 21, Job 36, 2 Corinthians 6","Exodus 19, Luke 22, Job 37, 2 Corinthians 7","Exodus 20, Luke 23, Job 38, 2 Corinthians 8","Exodus 21, Luke 24, Job 39, 2 Corinthians 9","Exodus 22, John 1, Job 40, 2 Corinthians 10","Exodus 23, John 2, Job 41, 2 Corinthians 11","Exodus 24, John 3, Job 42, 2 Corinthians 12","Exodus 25, John 4, Proverbs 1, 2 Corinthians 13","Exodus 26, John 5, Proverbs 2, Galatians 1","Exodus 27, John 6, Proverbs 3, Galatians 2","Exodus 28, John 7, Proverbs 4, Galatians 3","Exodus 29, John 8, Proverbs 5, Galatians 4","Exodus 30, John 9, Proverbs 6, Galatians 5","Exodus 31, John 10, Proverbs 7, Galatians 6","Exodus 32, John 11, Proverbs 8, Ephesians 1","Exodus 33, John 12, Proverbs 9, Ephesians 2","Exodus 34, John 13, Proverbs 10, Ephesians 3","Exodus 35, John 14, Proverbs 11, Ephesians 4","Exodus 36, John 15, Proverbs 12, Ephesians 5","Exodus 37, John 16, Proverbs 13, Ephesians 6","Exodus 38, John 17, Proverbs 14, Philippians 1","Exodus 39, John 18, Proverbs 15, Philippians 2","Exodus 40, John 19, Proverbs 16, Philippians 3","Leviticus 1, John 20, Proverbs 17, Philippians 4","Leviticus 2–3, John 21, Proverbs 18, Colossians 1","Leviticus 4, Psalms 1–2, Proverbs 19, Colossians 2","Leviticus 5, Psalms 3–4, Proverbs 20, Colossians 3","Leviticus 6, Psalms 5–6, Proverbs 21, Colossians 4","Leviticus 7, Psalms 7–8, Proverbs 22, 1 Thessalonians 1","Leviticus 8, Psalm 9, Proverbs 23, 1 Thessalonians 2","Leviticus 9, Psalm 10, Proverbs 24, 1 Thessalonians 3","Leviticus 10, Psalms 11–12, Proverbs 25, 1 Thessalonians 4","Leviticus 11–12, Psalms 13–14, Proverbs 26, 1 Thessalonians 5","Leviticus 13, Psalms 15–16, Proverbs 27, 2 Thessalonians 1","Leviticus 14, Psalm 17, Proverbs 28, 2 Thessalonians 2","Leviticus 15, Psalm 18, Proverbs 29, 2 Thessalonians 3","Leviticus 16, Psalm 19, Proverbs 30, 1 Timothy 1","Leviticus 17, Psalms 20–21, Proverbs 31, 1 Timothy 2","Leviticus 18, Psalm 22, Ecclesiastes 1, 1 Timothy 3","Leviticus 19, Psalms 23–24, Ecclesiastes 2, 1 Timothy 4","Leviticus 20, Psalm 25, Ecclesiastes 3, 1 Timothy 5","Leviticus 21, Psalms 26–27, Ecclesiastes 4, 1 Timothy 6","Leviticus 22, Psalms 28–29, Ecclesiastes 5, 2 Timothy 1","Leviticus 23, Psalm 30, Ecclesiastes 6, 2 Timothy 2","Leviticus 24, Psalm 31, Ecclesiastes 7, 2 Timothy 3","Leviticus 25, Psalm 32, Ecclesiastes 8, 2 Timothy 4","Leviticus 26, Psalm 33, Ecclesiastes 9, Titus 1","Leviticus 27, Psalm 34, Ecclesiastes 10, Titus 2","Numbers 1, Psalm 35, Ecclesiastes 11, Titus 3","Numbers 2, Psalm 36, Ecclesiastes 12, Philemon 1","Numbers 3, Psalm 37, Song of Solomon 1, Hebrews 1","Numbers 4, Psalm 38, Song of Solomon 2, Hebrews 2","Numbers 5, Psalm 39, Song of Solomon 3, Hebrews 3","Numbers 6, Psalms 40–41, Song of Solomon 4, Hebrews 4","Numbers 7, Psalms 42–43, Song of Solomon 5, Hebrews 5","Numbers 8, Psalm 44, Song of Solomon 6, Hebrews 6","Numbers 9, Psalm 45, Song of Solomon 7, Hebrews 7","Numbers 10, Psalms 46–47, Song of Solomon 8, Hebrews 8","Numbers 11, Psalm 48, Isaiah 1, Hebrews 9","Numbers 12–13, Psalm 49, Isaiah 2, Hebrews 10","Numbers 14, Psalm 50, Isaiah 3–4, Hebrews 11","Numbers 15, Psalm 51, Isaiah 5, Hebrews 12","Numbers 16, Psalms 52–54, Isaiah 6, Hebrews 13","Numbers 17–18, Psalm 55, Isaiah 7, James 1","Numbers 19, Psalms 56–57, Isaiah 8–9:7, James 2","Numbers 20, Psalms 58–59, Isaiah 9:8–10:4, James 3","Numbers 21, Psalms 60–61, Isaiah 10:5–34, James 4","Numbers 22, Psalms 62–63, Isaiah 11–12, James 5","Numbers 23, Psalms 64–65, Isaiah 13, 1 Peter 1","Numbers 24, Psalms 66–67, Isaiah 14, 1 Peter 2","Numbers 25, Psalm 68, Isaiah 15, 1 Peter 3","Numbers 26, Psalm 69, Isaiah 16, 1 Peter 4","Numbers 27, Psalms 70–71, Isaiah 17–18, 1 Peter 5","Numbers 28, Psalm 72, Isaiah 19–20, 2 Peter 1","Numbers 29, Psalm 73, Isaiah 21, 2 Peter 2","Numbers 30, Psalm 74, Isaiah 22, 2 Peter 3","Numbers 31, Psalms 75–76, Isaiah 23, 1 John 1","Numbers 32, Psalm 77, Isaiah 24, 1 John 2","Numbers 33, Psalm 78:1–37, Isaiah 25, 1 John 3","Numbers 34, Psalm 78:38–72, Isaiah 26, 1 John 4","Numbers 35, Psalm 79, Isaiah 27, 1 John 5","Numbers 36, Psalm 80, Isaiah 28, 2 John 1","Deuteronomy 1, Psalms 81–82, Isaiah 29, 3 John 1","Deuteronomy 2, Psalms 83–84, Isaiah 30, Jude 1","Deuteronomy 3, Psalm 85, Isaiah 31, Revelation 1","Deuteronomy 4, Psalms 86–87, Isaiah 32, Revelation 2","Deuteronomy 5, Psalm 88, Isaiah 33, Revelation 3","Deuteronomy 6, Psalm 89, Isaiah 34, Revelation 4","Deuteronomy 7, Psalm 90, Isaiah 35, Revelation 5","Deuteronomy 8, Psalm 91, Isaiah 36, Revelation 6","Deuteronomy 9, Psalms 92–93, Isaiah 37, Revelation 7","Deuteronomy 10, Psalm 94, Isaiah 38, Revelation 8","Deuteronomy 11, Psalms 95–96, Isaiah 39, Revelation 9","Deuteronomy 12, Psalms 97–98, Isaiah 40, Revelation 10","Deuteronomy 13–14, Psalms 99–101, Isaiah 41, Revelation 11","Deuteronomy 15, Psalm 102, Isaiah 42, Revelation 12","Deuteronomy 16, Psalm 103, Isaiah 43, Revelation 13","Deuteronomy 17, Psalm 104, Isaiah 44, Revelation 14","Deuteronomy 18, Psalm 105, Isaiah 45, Revelation 15","Deuteronomy 19, Psalm 106, Isaiah 46, Revelation 16","Deuteronomy 20, Psalm 107, Isaiah 47, Revelation 17","Deuteronomy 21, Psalms 108–109, Isaiah 48, Revelation 18","Deuteronomy 22, Psalms 110–111, Isaiah 49, Revelation 19","Deuteronomy 23, Psalms 112–113, Isaiah 50, Revelation 20","Deuteronomy 24, Psalms 114–115, Isaiah 51, Revelation 21","Deuteronomy 25, Psalm 116, Isaiah 52, Revelation 22","Deuteronomy 26, Psalms 117–118, Isaiah 53, Matthew 1","Deuteronomy 27–28:19, Psalm 119:1–24, Isaiah 54, Matthew 2","Deuteronomy 28:20–68, Psalm 119:25–48, Isaiah 55, Matthew 3","Deuteronomy 29, Psalm 119:49–72, Isaiah 56, Matthew 4","Deuteronomy 30, Psalm 119:73–96, Isaiah 57, Matthew 5","Deuteronomy 31, Psalm 119:97–120, Isaiah 58, Matthew 6","Deuteronomy 32, Psalm 119:121–144, Isaiah 59, Matthew 7","Deuteronomy 33–34, Psalm 119:145–176, Isaiah 60, Matthew 8","Joshua 1, Psalms 120–122, Isaiah 61, Matthew 9","Joshua 2, Psalms 123–125, Isaiah 62, Matthew 10","Joshua 3, Psalms 126–128, Isaiah 63, Matthew 11","Joshua 4, Psalms 129–131, Isaiah 64, Matthew 12","Joshua 5–6:5, Psalms 132–134, Isaiah 65, Matthew 13","Joshua 6:6–27, Psalms 135–136, Isaiah 66, Matthew 14","Joshua 7, Psalms 137–138, Jeremiah 1, Matthew 15","Joshua 8, Psalm 139, Jeremiah 2, Matthew 16","Joshua 9, Psalms 140–141, Jeremiah 3, Matthew 17","Joshua 10, Psalms 142–143, Jeremiah 4, Matthew 18","Joshua 11, Psalm 144, Jeremiah 5, Matthew 19","Joshua 12–13, Psalm 145, Jeremiah 6, Matthew 20","Joshua 14–15, Psalms 146–147, Jeremiah 7, Matthew 21","Joshua 16–17, Psalm 148, Jeremiah 8, Matthew 22","Joshua 18–19, Psalms 149–150, Jeremiah 9, Matthew 23","Joshua 20–21, Acts 1, Jeremiah 10, Matthew 24","Joshua 22, Acts 2, Jeremiah 11, Matthew 25","Joshua 23, Acts 3, Jeremiah 12, Matthew 26","Joshua 24, Acts 4, Jeremiah 13, Matthew 27","Judges 1, Acts 5, Jeremiah 14, Matthew 28","Judges 2, Acts 6, Jeremiah 15, Mark 1","Judges 3, Acts 7, Jeremiah 16, Mark 2","Judges 4, Acts 8, Jeremiah 17, Mark 3","Judges 5, Acts 9, Jeremiah 18, Mark 4","Judges 6, Acts 10, Jeremiah 19, Mark 5","Judges 7, Acts 11, Jeremiah 20, Mark 6","Judges 8, Acts 12, Jeremiah 21, Mark 7","Judges 9, Acts 13, Jeremiah 22, Mark 8","Judges 10–11:11, Acts 14, Jeremiah 23, Mark 9","Judges 11:12–40, Acts 15, Jeremiah 24, Mark 10","Judges 12, Acts 16, Jeremiah 25, Mark 11","Judges 13, Acts 17, Jeremiah 26, Mark 12","Judges 14, Acts 18, Jeremiah 27, Mark 13","Judges 15, Acts 19, Jeremiah 28, Mark 14","Judges 16, Acts 20, Jeremiah 29, Mark 15","Judges 17, Acts 21, Jeremiah 30–31, Mark 16","Judges 18, Acts 22, Jeremiah 32, Psalms 1–2","Judges 19, Acts 23, Jeremiah 33, Psalms 3–4","Judges 20, Acts 24, Jeremiah 34, Psalms 5–6","Judges 21, Acts 25, Jeremiah 35, Psalms 7–8","Ruth 1, Acts 26, Jeremiah 36, 45, Psalm 9","Ruth 2, Acts 27, Jeremiah 37, Psalm 10","Ruth 3–4, Acts 28, Jeremiah 38, Psalms 11–12","1 Samuel 1, Romans 1, Jeremiah 39, Psalms 13–14","1 Samuel 2, Romans 2, Jeremiah 40, Psalms 15–16","1 Samuel 3, Romans 3, Jeremiah 41, Psalm 17","1 Samuel 4, Romans 4, Jeremiah 42, Psalm 18","1 Samuel 5–6, Romans 5, Jeremiah 43, Psalm 19","1 Samuel 7–8, Romans 6, Jeremiah 44, Psalms 20–21","1 Samuel 9, Romans 7, Jeremiah 46, Psalm 22","1 Samuel 10, Romans 8, Jeremiah 47, Psalms 23–24","1 Samuel 11, Romans 9, Jeremiah 48, Psalm 25","1 Samuel 12, Romans 10, Jeremiah 49, Psalms 26–27","1 Samuel 13, Romans 11, Jeremiah 50, Psalms 28–29","1 Samuel 14, Romans 12, Jeremiah 51, Psalm 30","1 Samuel 15, Romans 13, Jeremiah 52, Psalm 31","1 Samuel 16, Romans 14, Lamentations 1, Psalm 32","1 Samuel 17, Romans 15, Lamentations 2, Psalm 33","1 Samuel 18, Romans 16, Lamentations 3, Psalm 34","1 Samuel 19, 1 Corinthians 1, Lamentations 4, Psalm 35","1 Samuel 20, 1 Corinthians 2, Lamentations 5, Psalm 36","1 Samuel 21–22, 1 Corinthians 3, Ezekiel 1, Psalm 37","1 Samuel 23, 1 Corinthians 4, Ezekiel 2, Psalm 38","1 Samuel 24, 1 Corinthians 5, Ezekiel 3, Psalm 39","1 Samuel 25, 1 Corinthians 6, Ezekiel 4, Psalms 40–41","1 Samuel 26, 1 Corinthians 7, Ezekiel 5, Psalms 42–43","1 Samuel 27, 1 Corinthians 8, Ezekiel 6, Psalm 44","1 Samuel 28, 1 Corinthians 9, Ezekiel 7, Psalm 45","1 Samuel 29–30, 1 Corinthians 10, Ezekiel 8, Psalms 46–47","1 Samuel 31, 1 Corinthians 11, Ezekiel 9, Psalm 48","2 Samuel 1, 1 Corinthians 12, Ezekiel 10, Psalm 49","2 Samuel 2, 1 Corinthians 13, Ezekiel 11, Psalm 50","2 Samuel 3, 1 Corinthians 14, Ezekiel 12, Psalm 51","2 Samuel 4–5, 1 Corinthians 15, Ezekiel 13, Psalms 52–54","2 Samuel 6, 1 Corinthians 16, Ezekiel 14, Psalm 55","2 Samuel 7, 2 Corinthians 1, Ezekiel 15, Psalms 56–57","2 Samuel 8–9, 2 Corinthians 2, Ezekiel 16, Psalms 58–59","2 Samuel 10, 2 Corinthians 3, Ezekiel 17, Psalms 60–61","2 Samuel 11, 2 Corinthians 4, Ezekiel 18, Psalms 62–63","2 Samuel 12, 2 Corinthians 5, Ezekiel 19, Psalms 64–65","2 Samuel 13, 2 Corinthians 6, Ezekiel 20, Psalms 66–67","2 Samuel 14, 2 Corinthians 7, Ezekiel 21, Psalm 68","2 Samuel 15, 2 Corinthians 8, Ezekiel 22, Psalm 69","2 Samuel 16, 2 Corinthians 9, Ezekiel 23, Psalms 70–71","2 Samuel 17, 2 Corinthians 10, Ezekiel 24, Psalm 72","2 Samuel 18, 2 Corinthians 11, Ezekiel 25, Psalm 73","2 Samuel 19, 2 Corinthians 12, Ezekiel 26, Psalm 74","2 Samuel 20, 2 Corinthians 13, Ezekiel 27, Psalms 75–76","2 Samuel 21, Galatians 1, Ezekiel 28, Psalm 77","2 Samuel 22, Galatians 2, Ezekiel 29, Psalm 78:1–37","2 Samuel 23, Galatians 3, Ezekiel 30, Psalm 78:38–72","2 Samuel 24, Galatians 4, Ezekiel 31, Psalm 79","1 Kings 1, Galatians 5, Ezekiel 32, Psalm 80","1 Kings 2, Galatians 6, Ezekiel 33, Psalms 81–82","1 Kings 3, Ephesians 1, Ezekiel 34, Psalms 83–84","1 Kings 4–5, Ephesians 2, Ezekiel 35, Psalm 85","1 Kings 6, Ephesians 3, Ezekiel 36, Psalm 86","1 Kings 7, Ephesians 4, Ezekiel 37, Psalms 87–88","1 Kings 8, Ephesians 5, Ezekiel 38, Psalm 89","1 Kings 9, Ephesians 6, Ezekiel 39, Psalm 90","1 Kings 10, Philippians 1, Ezekiel 40, Psalm 91","1 Kings 11, Philippians 2, Ezekiel 41, Psalms 92–93","1 Kings 12, Philippians 3, Ezekiel 42, Psalm 94","1 Kings 13, Philippians 4, Ezekiel 43, Psalms 95–96","1 Kings 14, Colossians 1, Ezekiel 44, Psalms 97–98","1 Kings 15, Colossians 2, Ezekiel 45, Psalms 99–101","1 Kings 16, Colossians 3, Ezekiel 46, Psalm 102","1 Kings 17, Colossians 4, Ezekiel 47, Psalm 103","1 Kings 18, 1 Thessalonians 1, Ezekiel 48, Psalm 104","1 Kings 19, 1 Thessalonians 2, Daniel 1, Psalm 105","1 Kings 20, 1 Thessalonians 3, Daniel 2, Psalm 106","1 Kings 21, 1 Thessalonians 4, Daniel 3, Psalm 107","1 Kings 22, 1 Thessalonians 5, Daniel 4, Psalms 108–109","2 Kings 1, 2 Thessalonians 1, Daniel 5, Psalms 110–111","2 Kings 2, 2 Thessalonians 2, Daniel 6, Psalms 112–113","2 Kings 3, 2 Thessalonians 3, Daniel 7, Psalms 114–115","2 Kings 4, 1 Timothy 1, Daniel 8, Psalm 116","2 Kings 5, 1 Timothy 2, Daniel 9, Psalms 117–118","2 Kings 6, 1 Timothy 3, Daniel 10, Psalm 119:1–24","2 Kings 7, 1 Timothy 4, Daniel 11, Psalm 119:25–48","2 Kings 8, 1 Timothy 5, Daniel 12, Psalm 119:49–72","2 Kings 9, 1 Timothy 6, Hosea 1, Psalm 119:73–96","2 Kings 10, 2 Timothy 1, Hosea 2, Psalm 119:97–120","2 Kings 11–12, 2 Timothy 2, Hosea 3–4, Psalm 119:121–144","2 Kings 13, 2 Timothy 3, Hosea 5–6, Psalm 119:145–176","2 Kings 14, 2 Timothy 4, Hosea 7, Psalms 120–122","2 Kings 15, Titus 1, Hosea 8, Psalms 123–125","2 Kings 16, Titus 2, Hosea 9, Psalms 126–128","2 Kings 17, Titus 3, Hosea 10, Psalms 129–131","2 Kings 18, Philemon 1, Hosea 11, Psalms 132–134","2 Kings 19, Hebrews 1, Hosea 12, Psalms 135–136","2 Kings 20, Hebrews 2, Hosea 13, Psalms 137–138","2 Kings 21, Hebrews 3, Hosea 14, Psalm 139","2 Kings 22, Hebrews 4, Joel 1, Psalms 140–141","2 Kings 23, Hebrews 5, Joel 2, Psalm 142","2 Kings 24, Hebrews 6, Joel 3, Psalm 143","2 Kings 25, Hebrews 7, Amos 1, Psalm 144","1 Chronicles 1–2, Hebrews 8, Amos 2, Psalm 145","1 Chronicles 3–4, Hebrews 9, Amos 3, Psalms 146–147","1 Chronicles 5–6, Hebrews 10, Amos 4, Psalms 148–150","1 Chronicles 7–8, Hebrews 11, Amos 5, Luke 1:1–38","1 Chronicles 9–10, Hebrews 12, Amos 6, Luke 1:39–80","1 Chronicles 11–12, Hebrews 13, Amos 7, Luke 2","1 Chronicles 13–14, James 1, Amos 8, Luke 3","1 Chronicles 15, James 2, Amos 9, Luke 4","1 Chronicles 16, James 3, Obadiah 1, Luke 5","1 Chronicles 17, James 4, Jonah 1, Luke 6","1 Chronicles 18, James 5, Jonah 2, Luke 7","1 Chronicles 19–20, 1 Peter 1, Jonah 3, Luke 8","1 Chronicles 21, 1 Peter 2, Jonah 4, Luke 9","1 Chronicles 22, 1 Peter 3, Micah 1, Luke 10","1 Chronicles 23, 1 Peter 4, Micah 2, Luke 11","1 Chronicles 24–25, 1 Peter 5, Micah 3, Luke 12","1 Chronicles 26–27, 2 Peter 1, Micah 4, Luke 13","1 Chronicles 28, 2 Peter 2, Micah 5, Luke 14","1 Chronicles 29, 2 Peter 3, Micah 6, Luke 15","2 Chronicles 1, 1 John 1, Micah 7, Luke 16","2 Chronicles 2, 1 John 2, Nahum 1, Luke 17","2 Chronicles 3–4, 1 John 3, Nahum 2, Luke 18","2 Chronicles 5–6:11, 1 John 4, Nahum 3, Luke 19","2 Chronicles 6:12–42, 1 John 5, Habakkuk 1, Luke 20","2 Chronicles 7, 2 John 1, Habakkuk 2, Luke 21","2 Chronicles 8, 3 John 1, Habakkuk 3, Luke 22","2 Chronicles 9, Jude 1, Zephaniah 1, Luke 23","2 Chronicles 10, Revelation 1, Zephaniah 2, Luke 24","2 Chronicles 11–12, Revelation 2, Zephaniah 3, John 1","2 Chronicles 13, Revelation 3, Haggai 1, John 2","2 Chronicles 14–15, Revelation 4, Haggai 2, John 3","2 Chronicles 16, Revelation 5, Zechariah 1, John 4","2 Chronicles 17, Revelation 6, Zechariah 2, John 5","2 Chronicles 18, Revelation 7, Zechariah 3, John 6","2 Chronicles 19–20, Revelation 8, Zechariah 4, John 7","2 Chronicles 21, Revelation 9, Zechariah 5, John 8","2 Chronicles 22–23, Revelation 10, Zechariah 6, John 9","2 Chronicles 24, Revelation 11, Zechariah 7, John 10","2 Chronicles 25, Revelation 12, Zechariah 8, John 11","2 Chronicles 26, Revelation 13, Zechariah 9, John 12","2 Chronicles 27–28, Revelation 14, Zechariah 10, John 13","2 Chronicles 29, Revelation 15, Zechariah 11, John 14","2 Chronicles 30, Revelation 16, Zechariah 12–13:1, John 15","2 Chronicles 31, Revelation 17, Zechariah 13:2–9, John 16","2 Chronicles 32, Revelation 18, Zechariah 14, John 17","2 Chronicles 33, Revelation 19, Malachi 1, John 18","2 Chronicles 34, Revelation 20, Malachi 2, John 19","2 Chronicles 35, Revelation 21, Malachi 3, John 20","2 Chronicles 36, Revelation 22, Malachi 4, John 21,"]

},{}],16:[function(require,module,exports){
module.exports=["Matthew 1","Matthew 2","Matthew 3","Matthew 4","Matthew 5:1-26","Matthew 5:27-48","Matthew 6:1-18","Matthew 6:19-34","Matthew 7","Matthew 8:1-17","Matthew 8:18-34","Matthew 9:1-17","Matthew 9:18-38","Matthew 10:1-20","Matthew 10:21-42","Matthew 11","Matthew 12:1-23","Matthew 12:24-50","Matthew 13:1-30","Matthew 13:31-58","Matthew 14:1-21","Matthew 14:22-36","Matthew 15:1-20","Matthew 15:21-39","Matthew 16","Matthew 17","Matthew 18:1-20","Matthew 18:21-35","Matthew 19","Matthew 20:1-16","Matthew 20:17-34","Matthew 21:1-22","Matthew 21:23-46","Matthew 22:1-22","Matthew 22:23-46","Matthew 23:1-22","Matthew 23:23-39","Matthew 24:1-28","Matthew 24:29-51","Matthew 25:1-30","Matthew 25:31-46","Matthew 26:1-25","Matthew 26:26-50","Matthew 26:51-75","Matthew 27:1-26","Matthew 27:27-50","Matthew 27:51-66","Matthew 28","Mark 1:1-22","Mark 1:23-45","Mark 2","Mark 3:1-19","Mark 3:20-35","Mark 4:1-20","Mark 4:21-41","Mark 5:1-20","Mark 5:21-43","Mark 6:1-29","Mark 6:30-56","Mark 7:1-13","Mark 7:14-37","Mark 8","Mark 9:1-29","Mark 9:30-50","Mark 10:1-31","Mark 10:32-52","Mark 11:1-18","Mark 11:19-33","Mark 12:1-27","Mark 12:28-44","Mark 13:1-20","Mark 13:21-37","Mark 14:1-26","Mark 14:27-53","Mark 14:54-72","Mark 15:1-25","Mark 15:26-47","Mark 16","Luke 1:1-20","Luke 1:21-38","Luke 1:39-56","Luke 1:57-80","Luke 2:1-24","Luke 2:25-52","Luke 3","Luke 4:1-30","Luke 4:31-44","Luke 5:1-16","Luke 5:17-39","Luke 6:1-26","Luke 6:27-49","Luke 7:1-30","Luke 7:31-50","Luke 8:1-25","Luke 8:26-56","Luke 9:1-17","Luke 9:18-36","Luke 9:37-62","Luke 10:1-24","Luke 10:25-42","Luke 11:1-28","Luke 11:29-54","Luke 12:1-31","Luke 12:32-59","Luke 13:1-22","Luke 13:23-35","Luke 14:1-24","Luke 14:25-35","Luke 15:1-10","Luke 15:11-32","Luke 16","Luke 17:1-19","Luke 17:20-37","Luke 18:1-23","Luke 18:24-43","Luke 19:1-27","Luke 19:28-48","Luke 20:1-26","Luke 20:27-47","Luke 21:1-19","Luke 21:20-38","Luke 22:1-30","Luke 22:31-46","Luke 22:47-71","Luke 23:1-25","Luke 23:26-56","Luke 24:1-35","Luke 24:36-53","John 1:1-28","John 1:29-51","John 2","John 3:1-18","John 3:19-36","John 4:1-30","John 4:31-54","John 5:1-24","John 5:25-47","John 6:1-21","John 6:22-44","John 6:45-71","John 7:1-27","John 7:28-53","John 8:1-27","John 8:28-59","John 9:1-23","John 9:24-41","John 10:1-23","John 10:24-42","John 11:1-29","John 11:30-57","John 12:1-26","John 12:27-50","John 13:1-20","John 13:21-38","John 14","John 15","John 16","John 17","John 18:1-18","John 18:19-40","John 19:1-22","John 19:23-42","John 20","John 21","Acts 1","Acts 2:1-21","Acts 2:22-47","Acts 3","Acts 4:1-22","Acts 4:23-37","Acts 5:1-21","Acts 5:22-42","Acts 6","Acts 7:1-21","Acts 7:22-43","Acts 7:44-60","Acts 8:1-25","Acts 8:26-40","Acts 9:1-21","Acts 9:22-43","Acts 10:1-23","Acts 10:24-48","Acts 11","Acts 12","Acts 13:1-25","Acts 13:26-52","Acts 14","Acts 15:1-21","Acts 15:22-41","Acts 16:1-21","Acts 16:22-40","Acts 17:1-15","Acts 17:16-34","Acts 18","Acts 19:1-20","Acts 19:21-41","Acts 20:1-16","Acts 20:17-38","Acts 21:1-17","Acts 21:18-40","Acts 22","Acts 23:1-15","Acts 23:16-35","Acts 24","Acts 25","Acts 26","Acts 27:1-26","Acts 27:27-44","Acts 28","Romans 1","Romans 2","Romans 3","Romans 4","Romans 5","Romans 6","Romans 7","Romans 8:1-21","Romans 8:22-39","Romans 9:1-15","Romans 9:16-33","Romans 10","Romans 11:1-18","Romans 11:19-36","Romans 12","Romans 13","Romans 14","Romans 15:1-13","Romans 15:14-33","Romans 16","1 Corinthians 1","1 Corinthians 2","1 Corinthians 3","1 Corinthians 4","1 Corinthians 5","1 Corinthians 6","1 Corinthians 7:1-19","1 Corinthians 7:20-40","1 Corinthians 8","1 Corinthians 9","1 Corinthians 10:1-18","1 Corinthians 10:19-33","1 Corinthians 11:1-16","1 Corinthians 11:17-34","1 Corinthians 12","1 Corinthians 13","1 Corinthians 14:1-20","1 Corinthians 14:21-40","1 Corinthians 15:1-28","1 Corinthians 15:29-58","1 Corinthians 16","2 Corinthians 1","2 Corinthians 2","2 Corinthians 3","2 Corinthians 4","2 Corinthians 5","2 Corinthians 6","2 Corinthians 7","2 Corinthians 8","2 Corinthians 9","2 Corinthians 10","2 Corinthians 11:1-15","2 Corinthians 11:16-33","2 Corinthians 12","2 Corinthians 13","Galatians 1","Galatians 2","Galatians 3","Galatians 4","Galatians 5","Galatians 6","Ephesians 1","Ephesians 2","Ephesians 3","Ephesians 4","Ephesians 5:1-16","Ephesians 5:17-33","Ephesians 6","Philippians 1","Philippians 2","Philippians 3","Philippians 4","Colossians 1","Colossians 2","Colossians 3","Colossians 4","1 Thessalonians 1","1 Thessalonians 2","1 Thessalonians 3","1 Thessalonians 4","1 Thessalonians 5","2 Thessalonians 1","2 Thessalonians 2","2 Thessalonians 3","1 Timothy 1","1 Timothy 2","1 Timothy 3","1 Timothy 4","1 Timothy 5","1 Timothy 6","2 Timothy 1","2 Timothy 2","2 Timothy 3","2 Timothy 4","Titus 1","Titus 2","Titus 3","Philemon 1","Hebrews 1","Hebrews 2","Hebrews 3","Hebrews 4","Hebrews 5","Hebrews 6","Hebrews 7","Hebrews 8","Hebrews 9","Hebrews 10:1-18","Hebrews 10:19-39","Hebrews 11:1-19","Hebrews 11:20-40","Hebrews 12","Hebrews 13","James 1","James 2","James 3","James 4","James 5","1 Peter 1","1 Peter 2","1 Peter 3","1 Peter 4","1 Peter 5","2 Peter 1","2 Peter 2","2 Peter 3","1 John 1","1 John 2","1 John 3","1 John 4","1 John 5","2 John 1","3 John 1","Jude 1","Revelation 1","Revelation 2","Revelation 3","Revelation 4","Revelation 5","Revelation 6","Revelation 7","Revelation 8","Revelation 9","Revelation 10","Revelation 11","Revelation 12","Revelation 13","Revelation 14","Revelation 15","Revelation 16","Revelation 17","Revelation 18","Revelation 19","Revelation 20","Revelation 21","Revelation 22"]

},{}],17:[function(require,module,exports){
module.exports=["Genesis 1-3, Matthew 1","Genesis 4-6, Matthew 2","Genesis 7-9, Matthew 3","Genesis 10-12, Matthew 4","Genesis 13-15, Matthew 5:1-26","Genesis 16-17, Matthew 5:27-48","Genesis 18-19, Matthew 6:1-18","Genesis 20-22, Matthew 6:19-34","Genesis 23-24, Matthew 7","Genesis 25-26, Matthew 8:1-17","Genesis 27-28, Matthew 8:18-34","Genesis 29-30, Matthew 9:1-17","Genesis 31-32, Matthew 9:18-38","Genesis 33-35, Matthew 10:1-20","Genesis 36-38, Matthew 10:21-42","Genesis 39-40, Matthew 11","Genesis 41-42, Matthew 12:1-23","Genesis 43-45, Matthew 12:24-50","Genesis 46-48, Matthew 13:1-30","Genesis 49-50, Matthew 13:31-58","Exodus 1-3, Matthew 14:1-21","Exodus 4-6, Matthew 14:22-36","Exodus 7-8, Matthew 15:1-20","Exodus 9-11, Matthew 15:21-39","Exodus 12-13, Matthew 16","Exodus 14-15, Matthew 17","Exodus 16-18, Matthew 18:1-20","Exodus 19-20, Matthew 18:21-35","Exodus 21-22, Matthew 19","Exodus 23-24, Matthew 20:1-16","Exodus 25-26, Matthew 20:17-34","Exodus 27-28, Matthew 21:1-22","Exodus 29-30, Matthew 21:23-46","Exodus 31-33, Matthew 22:1-22","Exodus 34-35, Matthew 22:23-46","Exodus 36-38, Matthew 23:1-22","Exodus 39-40, Matthew 23:23-39","Leviticus 1-3, Matthew 24:1-28","Leviticus 4-5, Matthew 24:29-51","Leviticus 6-7, Matthew 25:1-30","Leviticus 8-10, Matthew 25:31-46","Leviticus 11-12, Matthew 26:1-25","Leviticus 13, Matthew 26:26-50","Leviticus 14, Matthew 26:51-75","Leviticus 15-16, Matthew 27:1-26","Leviticus 17-18, Matthew 27:27-50","Leviticus 19-20, Matthew 27:51-66","Leviticus 21-22, Matthew 28","Leviticus 23-24, Mark 1:1-22","Leviticus 25, Mark 1:23-45","Leviticus 26-27, Mark 2","Numbers 1-2, Mark 3:1-19","Numbers 3-4, Mark 3:20-35","Numbers 5-6, Mark 4:1-20","Numbers 7-8, Mark 4:21-41","Numbers 9-11, Mark 5:1-20","Numbers 12-14, Mark 5:21-43","Numbers 15-16, Mark 6:1-29","Numbers 17-19, Mark 6:30-56","Numbers 20-22, Mark 7:1-13","Numbers 23-25, Mark 7:14-37","Numbers 26-28, Mark 8","Numbers 29-31, Mark 9:1-29","Numbers 32-34, Mark 9:30-50","Numbers 35-36, Mark 10:1-31","Deuteronomy 1-3, Mark 10:32-52","Deuteronomy 4-6, Mark 11:1-18","Deuteronomy 7-9, Mark 11:19-33","Deuteronomy 10-12, Mark 12:1-27","Deuteronomy 13-15, Mark 12:28-44","Deuteronomy 16-18, Mark 13:1-20","Deuteronomy 19-21, Mark 13:21-37","Deuteronomy 22-24, Mark 14:1-26","Deuteronomy 25-27, Mark 14:27-53","Deuteronomy 28-29, Mark 14:54-72","Deuteronomy 30-31, Mark 15:1-25","Deuteronomy 32-34, Mark 15:26-47","Joshua 1-3, Mark 16","Joshua 4-6, Luke 1:1-20","Joshua 7-9, Luke 1:21-38","Joshua 10-12, Luke 1:39-56","Joshua 13-15, Luke 1:57-80","Joshua 16-18, Luke 2:1-24","Joshua 19-21, Luke 2:25-52","Joshua 22-24, Luke 3","Judges 1-3, Luke 4:1-30","Judges 4-6, Luke 4:31-44","Judges 7-8, Luke 5:1-16","Judges 9-10, Luke 5:17-39","Judges 11-12, Luke 6:1-26","Judges 13-15, Luke 6:27-49","Judges 16-18, Luke 7:1-30","Judges 19-21, Luke 7:31-50","Ruth 1-4, Luke 8:1-25","1 Samuel 1-3, Luke 8:26-56","1 Samuel 4-6, Luke 9:1-17","1 Samuel 7-9, Luke 9:18-36","1 Samuel 10-12, Luke 9:37-62","1 Samuel 13-14, Luke 10:1-24","1 Samuel 15-16, Luke 10:25-42","1 Samuel 17-18, Luke 11:1-28","1 Samuel 19-21, Luke 11:29-54","1 Samuel 22-24, Luke 12:1-31","1 Samuel 25-26, Luke 12:32-59","1 Samuel 27-29, Luke 13:1-22","1 Samuel 30-31, Luke 13:23-35","2 Samuel 1-2, Luke 14:1-24","2 Samuel 3-5, Luke 14:25-35","2 Samuel 6-8, Luke 15:1-10","2 Samuel 9-11, Luke 15:11-32","2 Samuel 12-13, Luke 16","2 Samuel 14-15, Luke 17:1-19","2 Samuel 16-18, Luke 17:20-37","2 Samuel 19-20, Luke 18:1-23","2 Samuel 21-22, Luke 18:24-43","2 Samuel 23-24, Luke 19:1-27","1 Kings 1-2, Luke 19:28-48","1 Kings 3-5, Luke 20:1-26","1 Kings 6-7, Luke 20:27-47","1 Kings 8-9, Luke 21:1-19","1 Kings 10-11, Luke 21:20-38","1 Kings 12-13, Luke 22:1-30","1 Kings 14-15, Luke 22:31-46","1 Kings 16-18, Luke 22:47-71","1 Kings 19-20, Luke 23:1-25","1 Kings 21-22, Luke 23:26-56","2 Kings 1-3, Luke 24:1-35","2 Kings 4-6, Luke 24:36-53","2 Kings 7-9, John 1:1-28","2 Kings 10-12, John 1:29-51","2 Kings 13-14, John 2","2 Kings 15-16, John 3:1-18","2 Kings 17-18, John 3:19-36","2 Kings 19-21, John 4:1-30","2 Kings 22-23, John 4:31-54","2 Kings 24-25, John 5:1-24","1 Chronicles 1-3, John 5:25-47","1 Chronicles 4-6, John 6:1-21","1 Chronicles 7-9, John 6:22-44","1 Chronicles 10-12, John 6:45-71","1 Chronicles 13-15, John 7:1-27","1 Chronicles 16-18, John 7:28-53","1 Chronicles 19-21, John 8:1-27","1 Chronicles 22-24, John 8:28-59","1 Chronicles 25-27, John 9:1-23","1 Chronicles 28-29, John 9:24-41","2 Chronicles 1-3, John 10:1-23","2 Chronicles 4-6, John 10:24-42","2 Chronicles 7-9, John 11:1-29","2 Chronicles 10-12, John 11:30-57","2 Chronicles 13-14, John 12:1-26","2 Chronicles 15-16, John 12:27-50","2 Chronicles 17-18, John 13:1-20","2 Chronicles 19-20, John 13:21-38","2 Chronicles 21-22, John 14","2 Chronicles 23-24, John 15","2 Chronicles 25-27, John 16","2 Chronicles 28-29, John 17","2 Chronicles 30-31, John 18:1-18","2 Chronicles 32-33, John 18:19-40","2 Chronicles 34-36, John 19:1-22","Ezra 1-2, John 19:23-42","Ezra 3-5, John 20","Ezra 6-8, John 21","Ezra 9-10, Acts 1","Nehemiah 1-3, Acts 2:1-21","Nehemiah 4-7, Acts 2:22-47","Nehemiah 7-9, Acts 3","Nehemiah 10-11, Acts 4:1-22","Nehemiah 12-13, Acts 4:23-37","Esther 1-2, Acts 5:1-21","Esther 3-5, Acts 5:22-42","Esther 6-8, Acts 6","Esther 9-10, Acts 7:1-21","Job 1-2, Acts 7:22-43","Job 3-4, Acts 7:44-60","Job 5-7, Acts 8:1-25","Job 8-10, Acts 8:26-40","Job 11-13, Acts 9:1-21","Job 14-16, Acts 9:22-43","Job 17-19, Acts 10:1-23","Job 20-21, Acts 10:24-48","Job 22-24, Acts 11","Job 25-27, Acts 12","Job 28-29, Acts 13:1-25","Job 30-31, Acts 13:26-52","Job 32-33, Acts 14","Job 34-35, Acts 15:1-21","Job 36-37, Acts 15:22-41","Job 38-40, Acts 16:1-21","Job 41-42, Acts 16:22-40","Psalm 1-3, Acts 17:1-15","Psalm 4-6, Acts 17:16-34","Psalm 7-9, Acts 18","Psalm 10-12, Acts 19:1-20","Psalm 13-15, Acts 19:21-41","Psalm 16-17, Acts 20:1-16","Psalm 18-19, Acts 20:17-38","Psalm 20-22, Acts 21:1-17","Psalm 23-25, Acts 21:18-40","Psalm 26-28, Acts 22","Psalm 29-30, Acts 23:1-15","Psalm 31-32, Acts 23:16-35","Psalm 33-34, Acts 24","Psalm 35-36, Acts 25","Psalm 37-39, Acts 26","Psalm 40-42, Acts 27:1-26","Psalm 43-45, Acts 27:27-44","Psalm 46-48, Acts 28","Psalm 49-50, Romans 1","Psalm 51-53, Romans 2","Psalm 54-56, Romans 3","Psalm 57-59, Romans 4","Psalm 60-62, Romans 5","Psalm 63-65, Romans 6","Psalm 66-67, Romans 7","Psalm 68-69, Romans 8:1-21","Psalm 70-71, Romans 8:22-39","Psalm 72-73, Romans 9:1-15","Psalm 74-76, Romans 9:16-33","Psalm 77-78, Romans 10","Psalm 79-80, Romans 11:1-18","Psalm 81-83, Romans 11:19-36","Psalm 84-86, Romans 12","Psalm 87-88, Romans 13","Psalm 89-90, Romans 14","Psalm 91-93, Romans 15:1-13","Psalm 94-96, Romans 15:14-33","Psalm 97-99, Romans 16","Psalm 100-102, 1 Corinthians 1","Psalm 103-104, 1 Corinthians 2","Psalm 105-106, 1 Corinthians 3","Psalm 107-109, 1 Corinthians 4","Psalm 110-112, 1 Corinthians 5","Psalm 113-115, 1 Corinthians 6","Psalm 116-118, 1 Corinthians 7:1-19","Psalm 119:1-88, 1 Corinthians 7:20-40","Psalm 119:89-176, 1 Corinthians 8","Psalm 120-122, 1 Corinthians 9","Psalm 123-125, 1 Corinthians 10:1-18","Psalm 126-128, 1 Corinthians 10:19-33","Psalm 129-131, 1 Corinthians 11:1-16","Psalm 132-134, 1 Corinthians 11:17-34","Psalm 135-136, 1 Corinthians 12","Psalm 137-139, 1 Corinthians 13","Psalm 140-142, 1 Corinthians 14:1-20","Psalm 143-145, 1 Corinthians 14:21-40","Psalm 146-147, 1 Corinthians 15:1-28","Psalm 148-150, 1 Corinthians 15:29-58","Proverbs 1-2, 1 Corinthians 16","Proverbs 3-5, 2 Corinthians 1","Proverbs 6-7, 2 Corinthians 2","Proverbs 8-9, 2 Corinthians 3","Proverbs 10-12, 2 Corinthians 4","Proverbs 13-15, 2 Corinthians 5","Proverbs 16-18, 2 Corinthians 6","Proverbs 19-21, 2 Corinthians 7","Proverbs 22-24, 2 Corinthians 8","Proverbs 25-26, 2 Corinthians 9","Proverbs 27-29, 2 Corinthians 10","Proverbs 30-31, 2 Corinthians 11:1-15","Ecclesiastes 1-3, 2 Corinthians 11:16-33","Ecclesiastes 4-6, 2 Corinthians 12","Ecclesiastes 7-9, 2 Corinthians 13","Ecclesiastes 10-12, Galatians 1","Song of Solomon 1-3, Galatians 2","Song of Solomon 4-5, Galatians 3","Song of Solomon 6-8, Galatians 4","Isaiah 1-2, Galatians 5","Isaiah 3-4, Galatians 6","Isaiah 5-6, Ephesians 1","Isaiah 7-8, Ephesians 2","Isaiah 9-10, Ephesians 3","Isaiah 11-13, Ephesians 4","Isaiah 14-16, Ephesians 5:1-16","Isaiah 17-19, Ephesians 5:17-33","Isaiah 20-22, Ephesians 6","Isaiah 23-25, Philippians 1","Isaiah 26-27, Philippians 2","Isaiah 28-29, Philippians 3","Isaiah 30-31, Philippians 4","Isaiah 32-33, Colossians 1","Isaiah 34-36, Colossians 2","Isaiah 37-38, Colossians 3","Isaiah 39-40, Colossians 4","Isaiah 41-42, 1 Thessalonians 1","Isaiah 43-44, 1 Thessalonians 2","Isaiah 45-46, 1 Thessalonians 3","Isaiah 47-49, 1 Thessalonians 4","Isaiah 50-52, 1 Thessalonians 5","Isaiah 53-55, 2 Thessalonians 1","Isaiah 56-58, 2 Thessalonians 2","Isaiah 59-61, 2 Thessalonians 3","Isaiah 62-64, 1 Timothy 1","Isaiah 65-66, 1 Timothy 2","Jeremiah 1-2, 1 Timothy 3","Jeremiah 3-5, 1 Timothy 4","Jeremiah 6-8, 1 Timothy 5","Jeremiah 9-11, 1 Timothy 6","Jeremiah 12-14, 2 Timothy 1","Jeremiah 15-17, 2 Timothy 2","Jeremiah 18-19, 2 Timothy 3","Jeremiah 20-21, 2 Timothy 4","Jeremiah 22-23, Titus 1","Jeremiah 24-26, Titus 2","Jeremiah 27-29, Titus 3","Jeremiah 30-31, Philemon 1","Jeremiah 32-33, Hebrews 1","Jeremiah 34-36, Hebrews 2","Jeremiah 37-39, Hebrews 3","Jeremiah 40-42, Hebrews 4","Jeremiah 43-45, Hebrews 5","Jeremiah 46-47, Hebrews 6","Jeremiah 48-49, Hebrews 7","Jeremiah 50, Hebrews 8","Jeremiah 51-52, Hebrews 9","Lamentations 1-2, Hebrews 10:1-18","Lamentations 3-5, Hebrews 10:19-39","Ezekiel 1-2, Hebrews 11:1-19","Ezekiel 3-4, Hebrews 11:20-40","Ezekiel 5-7, Hebrews 12","Ezekiel 8-10, Hebrews 13","Ezekiel 11-13, James 1","Ezekiel 14-15, James 2","Ezekiel 16-17, James 3","Ezekiel 18-19, James 4","Ezekiel 20-21, James 5","Ezekiel 22-23, 1 Peter 1","Ezekiel 24-26, 1 Peter 2","Ezekiel 27-29, 1 Peter 3","Ezekiel 30-32, 1 Peter 4","Ezekiel 33-34, 1 Peter 5","Ezekiel 35-36, 2 Peter 1","Ezekiel 37-39, 2 Peter 2","Ezekiel 40-41, 2 Peter 3","Ezekiel 42-44, 1 John 1","Ezekiel 45-46, 1 John 2","Ezekiel 47-48, 1 John 3","Daniel 1-2, 1 John 4","Daniel 3-4, 1 John 5","Daniel 5-7, 2 John 1","Daniel 8-10, 3 John 1","Daniel 11-12, Jude 1","Hosea 1-4, Revelation 1","Hosea 5-8, Revelation 2","Hosea 9-11, Revelation 3","Hosea 12-14, Revelation 4","Joel 1-3, Revelation 5","Amos 1-3, Revelation 6","Amos 4-6, Revelation 7","Amos 7-9, Revelation 8","Obadiah 1, Revelation 9","Jonah 1-4, Revelation 10","Micah 1-3, Revelation 11","Micah 4-5, Revelation 12","Micah 6-7, Revelation 13","Nahum 1-3, Revelation 14","Habakkuk 1-3, Revelation 15","Zephaniah 1-3, Revelation 16","Haggai 1-2, Revelation 17","Zechariah 1-4, Revelation 18","Zechariah 5-8, Revelation 19","Zechariah 9-12, Revelation 20","Zechariah 13-14, Revelation 21","Malachi 1-4, Revelation 22"]

},{}],18:[function(require,module,exports){
//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function isFunction (sth) {
        // https://github.com/moment/moment/issues/2325
        return typeof sth === 'function' &&
            Object.prototype.toString.call(sth) === '[object Function]';
    }


    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    config._f = isoDates[i][0];
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    // match[6] should be 'T' or space
                    config._f += (match[6] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear, janX = createUTCDate(year, 0, 1 + week1Jan), d = janX.getUTCDay(), dayOfYear;
        if (d < firstDayOfWeek) {
            d += 7;
        }

        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (typeof this._isDSTShifted !== 'undefined') {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        this._weekdaysParse = this._weekdaysParse || [];

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toObject     = toObject;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.6';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],19:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}]},{},[1]);
