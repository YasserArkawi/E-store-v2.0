const joi = require("joi");
const fs = require("fs");
const validate = (schema) => {
  return (req, res, next) => {
    // console.log(req.body);
    // if (req.file?.path) {
    //   req.body.imagePath = req.file.path;
    // }

    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
      console.log(__dirname + ": ", error);
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      // const messages = error.map((err) => {
      //   return err.message;
      // });
      return res.status(400).send({ error: error.details[0]?.message });
    }
    next();
  };
};

module.exports = validate;
