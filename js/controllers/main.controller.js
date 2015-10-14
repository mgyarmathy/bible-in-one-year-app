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