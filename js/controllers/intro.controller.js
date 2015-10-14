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