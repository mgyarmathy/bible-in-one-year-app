(function () {
  'use strict';

  var moment = require('moment');
  var Services = require('../services/services.js');

  var app = angular.module('bibleInOneYear.controllers', ['ionic', Services]);

  app.controller('IntroCtrl', IntroCtrl);
  app.controller('MainCtrl', MainCtrl);
  app.controller('TodayCtrl', TodayCtrl);
  app.controller('ReadingPlanDayCtrl', ReadingPlanDayCtrl);

  IntroCtrl.$inject = ['$state', '$ionicSlideBoxDelegate', 'readingPlanService', 'settingsService'];

  function IntroCtrl($state, $ionicSlideBoxDelegate, readingPlanService, settingsService) {
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

  MainCtrl.$inject = ['$scope', '$state', '$ionicPopup', '$ionicHistory', 'readingPlanService', 'settingsService'];

  function MainCtrl($scope, $state, $ionicPopup, $ionicHistory, readingPlanService, settingsService) {
    var vm = this;

    vm.clearProgress = clearProgress;
    vm.readingPlan = readingPlanService.list();
    vm.recalibrateDates = recalibrateDates;
    vm.theme = settingsService.getTheme();

    $scope.$watch(readingPlanService.list, function() {
      vm.readingPlan = readingPlanService.list();
    });

    $scope.$watch(settingsService.getTheme, function() {
      vm.theme = settingsService.getTheme();
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

  TodayCtrl.$inject = ['$scope', '$state', '$timeout', 'readingPlanService'];

  function TodayCtrl($scope, $state, $timeout, readingPlanService) {
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

  ReadingPlanDayCtrl.$inject = ['$scope', '$state', '$stateParams', 'readingPlanService'];

  function ReadingPlanDayCtrl($scope, $state, $stateParams, readingPlanService) {
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

  module.exports = app.name;
})();