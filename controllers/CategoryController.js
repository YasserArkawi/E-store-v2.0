const CategoryService = require("../services/CategoryService");
const fs = require("fs");

module.exports = {
  getAllCategories: async (req, res) => {
    try {
      const results = await CategoryService.getAllCategories();
      res.status(200).send({
        data: results,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },
  getCategoryById: async (req, res) => {
    try {
      const result = await CategoryService.getCategoryById(req.params.id);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },

  // manager ///////////////////////////////////////////////

  addCategory: async (req, res) => {
    try {
      const data = req.body;
      data.imagePath = req.file?.path;
      const result = await CategoryService.addCategory(data);
      res.status(200).send({
        data: result.id,
        success: true,
      });
    } catch (error) {
      console.log(error);
      if (req.file?.path) {
        fs.unlinkSync(req.file?.path);
      }
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },
  editCategory: async (req, res) => {
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
      console.log(error);
      if (req.file?.path) {
        fs.unlinkSync(req.file?.path);
      }
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await CategoryService.deleteCategory(id);
      res.status(200).send({
        data: result.id,
        success: true,
      });
    } catch (error) {
      console.log(error);
      if (req.file?.path) {
        fs.unlinkSync(req.file?.path);
      }
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },
};
