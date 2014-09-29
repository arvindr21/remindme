var msg = require('../messages/messages.js');

var auth = {
  register: function(req, res) {
    var user = req.body;

    if (!user.username || !user.password || !user.name || !user.phone) {
      // Invalid Data
      res.status(400);
      res.json({
        "status": 400,
        "message": msg.auth_inputError
      });

    } else {
      var savedUser = require('../logic/auth/auth').register(user);
      delete savedUser.password;
      if (savedUser == -1) {
        res.status(409);
        res.json({
          "status": 409,
          "message": msg.auth_duplicateUser
        });
      } else {
        res.json({
          "status": 200,
          "message": msg.auth_registerSuccess,
          "user": savedUser
        });
      }
    }
  },
  login: function(req, res) {
    var user = req.body;
    if (!user.username || !user.password) {
      // Invalid Data
      res.status(400);
      res.json({
        "status": 400,
        "message": msg.auth_inputError
      });

    } else {
      var dbUser = require('../logic/auth/auth').login(user);
      if (dbUser == -1 || dbUser == -2) {
        res.status(400);
        res.json({
          "status": 400,
          "message": msg.auth_loginFailed
        });
      } else {
        res.json({
          "status": 200,
          "message": msg.auth_loginSuccess,
          "user": dbUser
        });
      }
    }
  }
}

module.exports = auth;
