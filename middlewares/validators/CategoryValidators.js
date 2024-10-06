const joi = require("joi");

// const getByIdValidator = joi.object({
//   id: joi.number().integer().required(),
// });

const createCategoryValidator = joi.object({
  title: joi.string().required(),
});

const editCategoryValidator = joi.object({
  // id: joi.number().integer().required(),
  title: joi.string(),
  image: joi.string().min(0).max(191).optional(),
});

// const deleteCategoryValidator = joi.object({
//   id: joi.number().integer().required(),
// });

module.exports = {
  // getByIdValidator,
  createCategoryValidator,
  editCategoryValidator,
  // deleteCategoryValidator,
};
