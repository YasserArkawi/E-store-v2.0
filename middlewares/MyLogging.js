const fs = require("fs");
const myLog = async (req, res, next) => {
  req.duration = new Date();
  const timeStamp = new Date().toString();
  const method = req.method;
  const url = req.url;
  const message = `REQUEST: ${method} ${url}   ${timeStamp} \n`;
  fs.appendFileSync("./helper/logger.txt", message, {});
  next();
};

const myErrorLog = async (error, next) => {
  const timeStamp = new Date().toString();
  let message;
  const errorMessage = error.message;
  const stack = error.stack;
  message = `\nERROR: ${errorMessage} ${stack}   ${timeStamp} \n`;
  fs.appendFileSync("./helper/logger.txt", message, {});
  next();
};

module.exports = { myLog, myErrorLog };
