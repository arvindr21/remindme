var msg = require('../messages/messages.js');

var reminder = {

  getAll: function(req, res) {
    var reminder = req.params;

    if (!reminder.userId) {
      // Invalid Data
      res.status(400);
      res.json({
        "status": 400,
        "message": msg.reminder_userIDMissing
      });

    } else {
      try {
        var reminder = require('../logic/reminder/reminder').getAll(reminder);
        res.status(200);
        res.json({
          "status": 200,
          "message": msg.gbl_success,
          "reminders": reminder
        });
      } catch (e) {
        res.status(500);
        res.json({
          "status": 500,
          "message": msg.gbl_oops
        });
      }
    }
  },
  getOne: function(req, res) {
    var rem = req.params;
    if (!rem.userId || !rem.reminderId) {
      // Invalid Data
      res.status(400);
      res.json({
        "status": 400,
        "message": msg.reminder_inputError
      });
    } else {
      try {
        var reminder = require('../logic/reminder/reminder').getOne(rem);
        res.status(200);
        res.json({
          "status": 200,
          "message": msg.gbl_success,
          "reminder": reminder
        });
      } catch (e) {
        res.status(500);
        res.json({
          "status": 500,
          "message": msg.gbl_oops
        });
      }

    }
  },
  create: function(req, res) {
    var reminder = req.body;
    reminder.userId = req.params.userId;

    console.log(reminder);

    if (!reminder.remindThis || !reminder.shdlCall || !reminder.shdlSMS) {
      // Invalid Data
      res.status(400);
      res.json({
        "status": 400,
        "message": msg.reminder_inputError
      });

    } else {

      var _v = require('../util/validate');

      if (!_v.validateSchdl(reminder.shdlCall) || !_v.validateSchdl(reminder.shdlSMS)) {
        res.status(400);
        res.json({
          "status": 400,
          "message": msg.reminder_ShdlError
        });
        return;
      }

      // Check user before processing the data
      var user = require('../db/db.auth.js').findById(reminder.userId);
      delete user.password;
      if (user) {
        reminder.user = user;
        var savedReminder = require('../logic/reminder/reminder').create(reminder);
        res.status(200);
        res.json({
          "status": 200,
          "message": msg.remider_newReminderSuccess,
          "reminder": savedReminder
        });
      } else {
        res.status(403);
        res.json({
          "status": 403,
          "message": msg.reminder_InvalidUser
        });
      }
    }
  },
  delete: function(req, res) {
    var rem = req.params;
    if (!rem.userId || !rem.reminderId) {
      // Invalid Data
      res.status(400);
      res.json({
        "status": 400,
        "message": msg.reminder_inputError
      });
    } else {
      try {
        var reminder = require('../logic/reminder/reminder').delete(rem);
        res.status(200);
        res.json({
          "status": 200,
          "message": msg.gbl_success,
          "delete": reminder
        });
      } catch (e) {
        res.status(500);
        res.json({
          "status": 500,
          "message": msg.gbl_oops
        });
      }

    }
  },
  cancel: function(req, res) {
    var reminder = req.params;
    if (!reminder.userId || !reminder.reminderId) {
      // Invalid Data
      res.status(400);
      res.json({
        "status": 400,
        "message": msg.reminder_inputError
      });
    } else {
      try {
        var status = require('../logic/reminder/reminder').cancel(reminder);
        res.status(200);
        res.json({
          "status": 200,
          "message": msg.gbl_success,
          "resp": status
        });
      } catch (e) {
        res.status(500);
        res.json({
          "status": 500,
          "message": msg.gbl_oops
        });
      }
    }
  }
}

module.exports = reminder;
