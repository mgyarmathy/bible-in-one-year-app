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