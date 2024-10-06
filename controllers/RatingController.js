const RatingService = require("../services/RatingService");
module.exports = {
  getRateByProduct: async (req, res) => {
    try {
      const result = await RatingService.getRateByProduct(req.params.id);
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

  addRate: async (req, res) => {
    try {
      const data = req.body;
      data.userId = req.user.id;
      const result = await RatingService.addRate(data);
      res.status(201).send({
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


  // manager //////////////////////////////////////////////////////////
  
  deleteRatesByUser: async (req, res) => {
    try {
      const result = await RatingService.deleteRatesByUser(req.params.id);
      res.status(200).send({
        state: result,
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

  deleteRatesByProduct: async (req, res) => {
    try {
      const result = await RatingService.deleteRatesByProduct(req.params.id);
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
