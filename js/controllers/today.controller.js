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