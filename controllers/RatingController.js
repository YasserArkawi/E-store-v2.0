const RatingService = require("../services/RatingService");
module.exports = {
  getRateByProduct: async (req, res, next) => {
    try {
      const result = await RatingService.getRateByProduct(req.params.id);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  addRate: async (req, res, next) => {
    try {
      const data = req.body;
      data.userId = req.user.id;
      const result = await RatingService.addRate(data);
      res.status(201).send({
        data: result,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  // deleteRate: async (req, res) => {
  //   try {
  //     const productId = +req.params.id;
  //     const userId = req.user.id;
  //     const result = await RatingService.deleteRate(productId, userId);
  //     res.status(200).send({
  //       data: result,
  //       success: true,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(400).send({
  //       data: error.meta?.cause || error.meta?.target || error.message,
  //       success: false,
  //     });
  //   }
  // },

  // manager //////////////////////////////////////////////////////////

  deleteRatesByUser: async (req, res, next) => {
    try {
      const result = await RatingService.deleteRatesByUser(req.params.id);
      res.status(200).send({
        state: result,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteRatesByProduct: async (req, res, next) => {
    try {
      const result = await RatingService.deleteRatesByProduct(req.params.id);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },
};
