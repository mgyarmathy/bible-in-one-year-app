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