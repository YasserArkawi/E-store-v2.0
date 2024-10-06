const ProductService = require("../services/ProductService");
const fs = require("fs");
module.exports = {
  getAllProducts: async (req, res) => {
    try {
      const results = await ProductService.getAllProducts();
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

  getAllAllProducts: async (req, res) => {
    try {
      const results = await ProductService.getAllAllProducts();
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

  getProductById: async (req, res) => {
    try {
      const result = await ProductService.getProductById(req.params.id);
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
  getProductsByCategory: async (req, res) => {
    try {
      const results = await ProductService.getProductsByCategory(req.params.id);
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
  getMostRatedProducts: async (req, res) => {
    try {
      const results = await ProductService.getMostRatedProducts();
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

  // manager /////////////////////////////////////////////////////////

  addProduct: async (req, res) => {
    try {
      const data = req.body;
      data.imagePath = req.file?.path;
      const result = await ProductService.addProduct(data);
      res.status(200).send({
        data: result.id,
        success: true,
      });
    } catch (error) {
      console.log(error.message);
      if (req.file?.path) {
        fs.unlinkSync(req.file?.path);
      }
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },
  editProduct: async (req, res) => {
    try {
      const data = req.body;
      data.id = req.params.id;
      data.imagePath = req.file?.path;
      const results = await ProductService.editProduct(data);
      res.status(200).send({
        data: results,
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
  deleteProduct: async (req, res) => {
    try {
      const result = await ProductService.deleteProduct(req.body.ids);
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
};
