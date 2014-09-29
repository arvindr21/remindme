var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

module.exports = {
  encryptPwd: function(pwd) {
    return bcrypt.hashSync(pwd, salt);
  },
  decryptPwd: function(pwd, hash) {
    return bcrypt.compareSync(pwd, hash);
  }
};
