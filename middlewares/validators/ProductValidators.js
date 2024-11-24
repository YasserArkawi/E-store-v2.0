const joi = require("joi");

const createProductsValidator = joi.object({
  categoryId: joi.number().integer().min(1).max(200).required(),
  title: joi.string().min(2).max(50).required(),
  descreption: joi.string().min(2).max(191).required(),
  price: joi.number().min(0.0).required(),
  availables: joi.number().integer().required(),
  images: joi.array().min(1).max(6).items(joi.string())
});

const updateProductsValidator = joi.object({
  categoryId: joi.number().integer().min(1).max(200).optional(),
  title: joi.string().min(2).max(50).optional(),
  descreption: joi.string().min(2).max(191).optional(),
  price: joi.number().min(0.0).optional(),
  availables: joi.number().integer().optional(),
});

const deleteProductsValidator = joi.object({
  ids: joi
    .array()
    .min(1)
    .items(joi.number().integer().positive())
    .unique()
    .required(),
});

module.exports = {
  createProductsValidator,
  updateProductsValidator,
  deleteProductsValidator,
};
