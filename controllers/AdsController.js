const AdsService = require("../services/AdsService");
const fs = require("fs");
module.exports = {
  getAllAds: async (req, res, next) => {
    try {
      const results = await AdsService.getAllAds();
      res.status(200).send({
        data: results,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  getAdById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const results = await AdsService.getAdById(id);
      res.status(200).send({
        data: results,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  // manager///////////////////////////////////////////////

  addAd: async (req, res, next) => {
    try {
      const data = req.body;
      data.imagePath = req.file?.path;
      const result = await AdsService.addAd(data);
      res.status(201).send({
        data: result,
        success: true,
      });
    } catch (error) {
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },

  deleteAd: async (req, res, next) => {
    try {
      const ids = req.body.ids;
      const result = await AdsService.deleteAd(ids);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  updateAd: async (req, res, next) => {
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
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },
};
