var angular = require('angular');
var moment = require('moment');
var ReadingPlan = require('bible-in-one-year');
var rp = new ReadingPlan();

if(typeof(Storage)!=="undefined") {

var app = angular.module('bibleInOneYearApp', [])

.controller('MainCtrl', function($scope) {
    $scope.readingPlan = JSON.parse(localStorage.getItem('ReadingPlan'));

    $scope.start = function() {
        $scope.readingPlan = [];
        for(var i = 0; i<rp.length(); i++) {
            var day = moment().add(i, 'days').format('MMMM Do YYYY');
            $scope.readingPlan.push({date: day, scripture: rp.getDay(i)});
            localStorage.setItem('ReadingPlan', JSON.stringify($scope.readingPlan));
        }
    };

    $scope.delete = function() {
        $scope.readingPlan = [];
        localStorage.removeItem('ReadingPlan');
    }
});

} else {
    alert('Sorry! Your browser does not support web storage.');
}
