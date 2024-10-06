const joi = require("joi");
const createAdValidator = joi.object({
  title: joi.string().min(2).max(50).required(),
  descreption: joi.string().min(2).max(191).required(),
});

const updateAdValidator = joi.object({
  title: joi.string().min(2).max(50).optional(),
  descreption: joi.string().min(2).max(191).optional(),
});

const deleteAdValidator = joi.object({
  ids: joi.array().min(1).items(joi.number().integer()).unique().required(),
});

module.exports = {
  createAdValidator,
  updateAdValidator,
  deleteAdValidator,
};
