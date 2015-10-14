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