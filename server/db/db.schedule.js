var db = require('diskdb');
db = db.connect('database', ['schedules']);

module.exports = {
  saveJob: function(job) {
    return db.schedules.save(job);
  },
  deleteJob: function(remId) {
    return db.schedules.remove({
      "remId": remId
    })
  }
};
