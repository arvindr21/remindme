var db = require('diskdb');
db = db.connect('database', ['users']);

module.exports = {
  register: function(user) {
    var hasDuplicate = this.findUser(user.username);
    if (hasDuplicate) {
      return -1; // duplicate
    } else {
      return db.users.save(user);
    }
  },
  findUser: function(username) {
    return db.users.findOne({
      "username": username
    });
  },
  findById: function(id) {
    return db.users.findOne({
      "_id": id
    });
  }
};
