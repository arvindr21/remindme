angular.module('remindMe.controllers', [])

.controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AuthFactory', 'SessionFactory',
  function($scope, $rootScope, $location, AuthFactory, SessionFactory) {

    $scope.login = {
      username: '',
      password: ''
    };

    $scope.loginUser = function() {
      $rootScope.showLoading("Authenticating..");
      AuthFactory.login($scope.login).success(function(data) {
        SessionFactory.createSession(data.user);
        $location.path('/home');
        $rootScope.hideLoading();
      }).error(function(data) {
        if (data.status == 400) {
          $rootScope.hideLoading();
          $rootScope.toast('Invalid Credentials');
        }
      });
    };

  }
])

.controller('RegisterCtrl', ['$scope', '$rootScope', '$location', 'AuthFactory', 'SessionFactory',
  function($scope, $rootScope, $location, AuthFactory, SessionFactory) {
    $scope.reg = {
      username: '',
      password: '',
      name: '',
      phone: ''
    };

    $scope.registerUser = function() {
      $rootScope.showLoading("Registering..");
      AuthFactory.register($scope.reg).success(function(data) {
        SessionFactory.createSession(data.user);
        // redirect
        $location.path('/home');
        $rootScope.hideLoading();
      }).error(function(data) {
        if (data.status == 400) {
          $rootScope.hideLoading();
          $rootScope.toast('Invalid Credentials');
        } else if (data.status == 409) {
          $rootScope.hideLoading();
          $rootScope.toast('A user with this username already exists');
        }
      });
    };
  }
])

.controller('HomeCtrl', ['$scope', '$rootScope', 'SessionFactory', 'ReminderFactory', '$ionicModal', '$timeout',
  function($scope, $rootScope, SessionFactory, ReminderFactory, $ionicModal, $timeout) {
    $scope.reminders = [];

    // Trigger Load reminders
    $timeout(function() {
      $rootScope.$broadcast('load-reminders');
    }, 9); // Race Condition

    $scope.doRefresh = function() {
      $rootScope.$broadcast('load-reminders');
      $scope.$broadcast('scroll.refreshComplete');
    }

    $rootScope.createNew = function() {
      $scope.modal.show();
    }

    $ionicModal.fromTemplateUrl('templates/newReminder.html', function(modal) {
      $scope.modal = modal;
    }, {
      animation: 'slide-in-up',
      focusFirstInput: true
    });

    $rootScope.$on('load-reminders', function(event) {
      $rootScope.showLoading('Fetching Reminders..');
      var user = SessionFactory.getSession();
      ReminderFactory.getAll(user._id).success(function(data) {
        $scope.reminders = data.reminders;
        $rootScope.hideLoading();
      }).error(function(data) {
        $rootScope.hideLoading();
        $rootScope.toast('Oops.. Something went wrong');
      });
    });

    $scope.deleteReminder = function(reminder) {
      $rootScope.showLoading('Deleting Reminder..');

      ReminderFactory.delete(reminder.userId, reminder._id)
        .success(function(data) {
          console.log(data);
          $rootScope.hideLoading();
          $rootScope.$broadcast('load-reminders');
        }).error(function(data) {
          $rootScope.hideLoading();
          console.log(data);
        })
    }

  }
])

.controller('NewReminderCtrl', ['$scope', '$ionicPopup', '$filter', '$rootScope', 'ReminderFactory', 'SessionFactory',
  function($scope, $ionicPopup, $filter, $rootScope, ReminderFactory, SessionFactory) {

    /** http://codepen.io/ooystein/pen/edjyH **/
    $scope.reminder = {
      'remindThis': '',
      'formattedDate': '',
      'shdlSMS': true,
      'shdlCall': true

    };

    $scope.$watch('reminder.formattedDate', function(unformattedDate) {
      $scope.reminder.formattedDate = $filter('date')(unformattedDate, 'dd/MM/yyyy HH:mm');
    });

    $scope.createReminder = function() {
      $rootScope.showLoading('Creating..');
      var user = SessionFactory.getSession();
      var _r = $scope.reminder;
      var d = new Date(_r.fullDate);

      if (_r.shdlSMS) _r.shdlSMS = d.getTime();
      if (_r.shdlCall) _r.shdlCall = d.getTime();

      delete _r.formattedDate;
      delete _r.fullDate;

      ReminderFactory.create(user._id, _r).success(function(data) {
        $rootScope.hideLoading();
        $scope.modal.hide();
        $rootScope.$broadcast('load-reminders');
      }).error(function(data) {
        $rootScope.hideLoading();
        console.log(data);
      });


    };

    $scope.openDatePicker = function() {
      $scope.tmp = {};
      $scope.tmp.newDate = $scope.reminder.formattedDate;

      var remindWhen = $ionicPopup.show({
        template: '<datetimepicker ng-model="tmp.newDate"></datetimepicker>',
        title: "When to Remind",
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Select</b>',
          type: 'button-stable',
          onTap: function(e) {
            $scope.reminder.fullDate = $scope.tmp.newDate;
            $scope.reminder.formattedDate = $scope.tmp.newDate;
          }
        }]
      });
    }

  }
]);
