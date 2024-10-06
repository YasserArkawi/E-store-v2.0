const joi = require("joi");

const createUserValidator = joi.object({
  name: joi.string().min(2).max(191).required(),
  email: joi
    .string()
    .max(191)
    .email()
    .pattern(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/)
    .message("Invalid email pattern")
    .required(),
  password: joi.string().min(8).max(24).required(),
  phone: joi.string().min(6).max(15).required(),
  isAdmin: joi.number().integer().min(0).max(1).optional(),
  image: joi.optional(),
  imagePath: joi.string().max(191).optional(),
});

const updateUserValidator = joi.object({
  name: joi.string().min(2).max(191).optional(),
  email: joi
    .string()
    .max(191)
    .email()
    .pattern(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/)
    .message("Invalid email pattern")
    .optional(),
  password: joi.string().min(8).max(24).optional(),
  phone: joi.string().min(6).max(15).optional(),
  isAdmin: joi.number().integer().min(0).max(1).optional(),
  image: joi.optional(),
  imagePath: joi.string().max(191).optional(),
});

const updateBalanceValidator = joi.object({
  balance: joi
    .number()
    .min(0)
    .message("Balance has to be larger than 0.")
    .required(),
});

module.exports = {
  createUserValidator,
  updateUserValidator,
  updateBalanceValidator,
};
