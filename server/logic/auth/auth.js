var db = require('../../db/db.auth');
var crypt = require('./crypt');

var auth = {

  register: function(user) {
    // create a password hash
    user.password = crypt.encryptPwd(user.password);

    // save the credentials in the database
    return db.register(user);

  },

  login: function(user) {
    var dbUser = db.findUser(user.username);
    if (dbUser) {
      if (crypt.decryptPwd(user.password, dbUser.password)) {
        delete dbUser.password; // Remove the password from response
        return dbUser;
      } else {
        return -1;
      }
    } else {
      return -2;
    }

  }

};

module.exports = auth;
