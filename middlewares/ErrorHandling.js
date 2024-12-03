const { myErrorLog } = require("./MyLogging");

const errorHandling = (error, req, res, next) => {
  console.log(error.message);
  myErrorLog(error, next);
  return res.status(400).send({
    data: error.meta?.cause || error.meta?.target || error.message,
    success: false,
  });
};

module.exports = errorHandling;
