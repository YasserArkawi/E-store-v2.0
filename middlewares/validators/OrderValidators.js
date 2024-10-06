const joi = require("joi");

const createOrderValidator = joi.object({
  products: joi
    .array()
    .min(1)
    .items(
      joi.object({
        id: joi.number().integer().min(1).required(),
        quantity: joi.number().integer().min(1).optional(),
      })
    )
    .required(),
  paymentType: joi.string().min(4).required(),
});

const deleteOrdersValidator = joi.object({
  ids: joi.array().min(1).items(joi.number().integer()).unique().required(),
});

const manageOrdersValidator = joi.object({
  userId: joi.number().integer().min(1).required(),
  paymentStatus: joi.string().required(),
});

module.exports = {
  createOrderValidator,
  deleteOrdersValidator,
  manageOrdersValidator,
};
