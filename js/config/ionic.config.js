(function () {
  'use strict';

  ionicConfig.$inject = ['$ionicConfigProvider'];

  function ionicConfig($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
  }

  module.exports = ionicConfig;
})();