const joi = require("joi");

const createRateValidator = joi.object({
  productId: joi.number().integer().min(1).required(),
  rating: joi
    .number()
    .min(0)
    .message("0 <= Rating <= 5")
    .max(5)
    .message("0 <= Rating <= 5")
    .required(),
});

module.exports = {
  createRateValidator,
};
