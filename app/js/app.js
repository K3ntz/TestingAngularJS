var testingAngluarApp = angular.module('testingAngularApp', []);

testingAngluarApp.controller('testingAngularCtrl', ['conversionHelper', '$http', '$rootScope', '$scope', '$timeout', function (conversionHelper, $http, $rootScope, $scope, $timeout) {
    
  $scope.title = "Testing AngularJS Applications";
  $scope.apiKey = "2de143494c0b295cca9337e1e96b00e0";

  $scope.destinations = [];
  $scope.newDestination = {
    city: null,
    country: null
  };

  $scope.addDestination = function () {
    $scope.destinations.push(
    { 
      city: $scope.newDestination.city, 
      country: $scope.newDestination.country
    });
  };
  
  $scope.removeDestination = function (index) {
    $scope.destinations.splice(index, 1);
  }
  
  $scope.getWeather = function(destination) {
    $http.get('http://api.openweathermap.org/data/2.5/weather?q='+ destination.city + "&appid=" + $scope.apiKey)
      .then(function successCallback(response) {
        if (response.data.weather) {
          destination.weather = {};
          destination.weather.main = response.data.weather[0].main; //return only first weather present
          destination.weather.temp = conversionHelper.convertKelvinToCelsius(response.data.main.temp); 
        } else if (response.data.message) {
          $scope.message = response.data.message;
        }
      }, function errorCallback(response) {
        $scope.message = "Could not retrieve weather for " + destination.city;
      });
  };
  
  $scope.messageWatcher = $scope.$watch('message', function () {
    if ($scope.message) {
      $timeout(function () {
        $scope.message = null;
      }, 3000);
    }
  });
    
}]);

testingAngluarApp.filter('warmestDestinations', function () {
  
  return function (destinations, minimumTemp) {
    var warmDestinations = [];
    angular.forEach(destinations, function (destination) {
      if (destination.weather && destination.weather.temp && destination.weather.temp > minimumTemp) {
        warmDestinations.push(destination);
      }
    });
    
    return warmDestinations;
  };
  
});

testingAngluarApp.service('conversionHelper', function ($http) {
  var conversionHelper = 
    {
      convertKelvinToCelsius: function (temperature) {
        return Math.round(temperature - 273);
      } 
    };
  
  return conversionHelper;
  
});