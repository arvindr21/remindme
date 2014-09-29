var schDB = require('../../db/db.schedule');
var remDB = require('../../db/db.reminder');
var tSMS = require('../twilio/triggerSMS');
var tCall = require('../twilio/triggerCall');

var schedule = require('node-schedule');

var scheduler = {

  scheduleCall: function(reminder) {

    var job = schedule.scheduleJob('job_call_' + reminder._id, new Date(parseInt(reminder.shdlCall)), function() {
      tCall.triggerCall(reminder);
      remDB.updateStatus(reminder._id);
    });

    job.remId = reminder._id; // Tag the job with a reminder ID
    return schDB.saveJob(job);

  },

  scheduleSMS: function(reminder) {

    var job = schedule.scheduleJob('job_sms_' + reminder._id, new Date(parseInt(reminder.shdlSMS)), function() {
      tSMS.triggerSMS(reminder);
      remDB.updateStatus(reminder._id);
    });

    job.reminderId = reminder._id; // Tag the job with a reminder ID
    return schDB.saveJob(job);
  },

  cancelJob: function(reminderId) {
    var jobs = schedule.scheduledJobs;

    var smsJob = jobs["job_sms_" + reminderId];
    var callJob = jobs["job_call_" + reminderId];

    if (smsJob) {
      smsJob.cancel();
    }
    if (callJob) {
      callJob.cancel();
    }
    return true;
  }
}

module.exports = scheduler;
