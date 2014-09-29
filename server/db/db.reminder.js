var db = require('diskdb');
db = db.connect('database', ['reminders']);

module.exports = {
  getAll: function(usrId) {
    return db.reminders.find({
      "userId": usrId
    });
  },
  getOne: function(remId) {
    return db.reminders.findOne({
      "_id": remId
    });
  },
  create: function(reminder) {
    return db.reminders.save(reminder);
  },
  updateStatus: function(remid) {
    return db.reminders.update({
      "_id": remid
    }, {
      "isCompleted": true
    });
  },
  delete: function(remId) {
    return db.reminders.remove({
      "_id": remId
    });
  }
};
