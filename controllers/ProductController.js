const ProductService = require("../services/ProductService");
const fs = require("fs");
module.exports = {
  getAllProducts: async (req, res) => {
    try {
      const hPrice = +req.query.price || undefined;
      const skip = +req.query.skip || undefined;
      const take = +req.query.take || undefined;
      const data = { hPrice, skip, take };

      const results = await ProductService.getAllProducts(data);
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

  getRecommend: async (req, res) => {
    try {
      const results = await ProductService.getProductsByCategory(
        req.params.categoryId
      );
      for (let i = 0; i <= results.length / 2; i++) {
        let n = Math.floor(Math.random() * results.length);
        [results[i], results[n]] = [results[n], results[i]];
      }

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

  getProductsByCategory: async (req, res) => {
    try {
      const skip = +req.query.skip || undefined;
      const take = +req.query.take || undefined;
      const hPrice = req.query.price;
      const results = await ProductService.getProductsByCategory(
        req.params.id,
        hPrice,
        take,
        skip
      );
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

  getAllAllProducts: async (req, res) => {
    try {
      const skip = +req.query.skip || undefined;
      const take = +req.query.take || undefined;
      const data = { skip, take };
      const results = await ProductService.getAllAllProducts(data);
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
      let data = req.body;
      console.log(data);
      data.id = req.params.id;
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

  addImagesProduct: async (req, res) => {
    let imagesDelete = [];
    const data = req.body;
    data.newImages = req.files.map((file) => {
      return file.path;
    });
    imagesDelete = data.newImages;
    try {
      data.id = req.params.id;
      const productImages = await ProductService.getImagesByProduct(data.id);
      if (productImages.length + data.newImages.length > 7) {
        throw new Error("The max number of images is 7.");
      } else {
        const result = await ProductService.addImagesProduct(data);
        res.status(200).send({
          data: result,
          success: true,
        });
      }
    } catch (error) {
      console.log(error);
      for (let i = 0; i < imagesDelete.length; i++) {
        fs.unlinkSync(imagesDelete[i]);
      }
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },

  editImagesProduct: async (req, res) => {
    let imagesDelete = [];
    const data = req.body;
    data.newImages = req.files.map((file) => {
      return file.path;
    });
    imagesDelete = data.newImages;
    try {
      data.id = req.params.id;
      const result = await ProductService.editProductImages(data);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      console.log(error);
      for (let i = 0; i < imagesDelete.length; i++) {
        fs.unlinkSync(imagesDelete[i]);
      }
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },

  deleteImagesProduct: async (req, res) => {
    try {
      // const id = req.params.id;
      const result = await ProductService.deleteImagesProduct(req.body.ids);
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
};
