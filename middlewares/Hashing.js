const bcrypt = require("bcrypt");
require("dotenv").config();

const myHashing = async (pass) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
  return await bcrypt.hash(pass, salt);
};

const myComparing = async (pass1, pass2) => {
  return await bcrypt.compare(pass1, pass2);
};

module.exports = {
  myHashing,
  myComparing,
};
