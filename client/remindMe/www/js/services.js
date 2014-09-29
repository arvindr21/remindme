var baseUrl = 'http://20585314.ngrok.com';

angular.module('remindMe.services', [])

.factory('AuthFactory', ['$http',
  function($http) {
    var _authFactory = {};

    _authFactory.register = function(user) {
      return $http.post(baseUrl + '/api/v1/auth/register', user);
    }

    _authFactory.login = function(user) {
      return $http.post(baseUrl + '/api/v1/auth/login', user);
    }

    return _authFactory;
  }
])

.factory('SessionFactory', ['$window',
  function($window) {
    var _sessionFactory = {};

    _sessionFactory.createSession = function(user) {
      return $window.localStorage.user = JSON.stringify(user);
    },

    _sessionFactory.getSession = function(user) {
      return JSON.parse($window.localStorage.user);
    },

    _sessionFactory.deleteSession = function() {
      delete $window.localStorage.user;
      return true;
    }

    _sessionFactory.checkSession = function() {
      if ($window.localStorage.user) {
        return true;
      } else {
        return false;
      }
    }

    return _sessionFactory;
  }
])

.factory('ReminderFactory', ['$http',
  function($http) {
    var _remFactory = {};

    _remFactory.getAll = function(userId) {
      var t = Date.now();
      return $http.get(baseUrl + '/api/v1/reminders/' + userId+'?_t='+t);
    }

    _remFactory.create = function(userId, reminder) {
      return $http.post(baseUrl + '/api/v1/reminder/' + userId + '/create', reminder);
    }

    _remFactory.delete = function(userId, reminderId) {
      return $http.delete(baseUrl + '/api/v1/reminder/' + userId + '/' + reminderId);
    }
    return _remFactory;
  }
])
