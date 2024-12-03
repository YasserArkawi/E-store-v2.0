const CategoryService = require("../services/CategoryService");
const fs = require("fs");

module.exports = {
  getAllCategories: async (req, res,next) => {
    try {
      const skip = +req.query.skip || undefined;
      const take = +req.query.take || undefined;
      const data = { skip, take };
      const results = await CategoryService.getAllCategories(data);
      res.status(200).send({
        data: results,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  getCategoryById: async (req, res,next) => {
    try {
      const result = await CategoryService.getCategoryById(req.params.id);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  // manager ///////////////////////////////////////////////

  getAllAllCategories: async (req, res,next) => {
    try {
      const skip = +req.query.skip || undefined;
      const take = +req.query.take || undefined;
      const data = { skip, take };
      const results = await CategoryService.getAllAllCategories(data);
      res.status(200).send({
        data: results,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  addCategory: async (req, res,next) => {
    try {
      const data = req.body;
      data.imagePath = req.file?.path;
      const result = await CategoryService.addCategory(data);
      res.status(200).send({
        data: result.id,
        success: true,
      });
    } catch (error) {
      if (req.file?.path) {
        fs.unlinkSync(req.file?.path);
      }
      next(error);
    }
  },

  editCategory: async (req, res,next) => {
    try {
      const data = req.body;
      data.id = req.params.id;
      data.imagePath = req.file?.path;
      const result = await CategoryService.editCategory(data);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      if (req.file?.path) {
        fs.unlinkSync(req.file?.path);
      }
      next(error);
    }
  },

  deleteCategory: async (req, res,next) => {
    try {
      const id = req.params.id;
      const result = await CategoryService.deleteCategory(id);
      res.status(200).send({
        data: result.id,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },
};
