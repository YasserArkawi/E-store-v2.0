const AdsService = require("../services/AdsService");
const fs = require("fs");
module.exports = {
  getAllAds: async (req, res) => {
    try {
      const results = await AdsService.getAllAds();
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

  getAdById: async (req, res) => {
    try {
      const id = req.params.id;
      const results = await AdsService.getAdById(id);
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

  // manager///////////////////////////////////////////////

  addAd: async (req, res) => {
    try {
      const data = req.body;
      data.imagePath = req.file?.path;
      const result = await AdsService.addAd(data);
      res.status(201).send({
        data: result,
        success: true,
      });
    } catch (error) {
      console.log(error);
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },

  deleteAd: async (req, res) => {
    try {
      const ids = req.body.ids;
      const result = await AdsService.deleteAd(ids);
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

  updateAd: async (req, res) => {
    try {
      const data = req.body;
      data.id = req.params.id;
      data.imagePath = req.file?.path;
      const result = await AdsService.updateAd(data);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      console.log(error);
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },
};
