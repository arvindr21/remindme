var db = require('../../db/db.reminder');
var shdlr = require('../scheduler/schedule');

var reminder = {

  getAll: function(reminder) {
    return db.getAll(reminder.userId);
  },

  getOne: function(reminder) {
    return db.getOne(reminder.reminderId);
  },
  create: function(reminder) {
    reminder.isCompleted = false;
    var savedReminder = db.create(reminder);
    // Schedule SMS/Call
    if (savedReminder) {
      if (String(savedReminder.shdlCall).toLowerCase() != 'false') {
        savedReminder.callJob = shdlr.scheduleCall(savedReminder);
      }
      if (String(savedReminder.shdlSMS).toLowerCase() != 'false') {
        savedReminder.smsJob = shdlr.scheduleSMS(savedReminder);
      }
    }
    return savedReminder;
  },
  cancel: function(reminder) {
    return shdlr.cancelJob(reminder.reminderId);
  },
  delete: function(reminder) {
    // cancel jobs
    shdlr.cancelJob(reminder.reminderId);

    // remove the saved schedules
    require('../../db/db.schedule').deleteJob(reminder.reminderId);

    // delete the reminder
    return db.delete(reminder.reminderId);
  }
};

module.exports = reminder;
