const LikesService = require("../services/LikesService");

module.exports = {
  getLikesByUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await LikesService.getLikesByUser(userId);
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

  addLike: async (req, res) => {
    try {
      const userId = req.user.id;
      const data = req.body;
      data.userId = userId;
      if (!data.user_id || !data.product_id) {
        res.status(400).send({ message: "Missing required data" });
      } else {
        const result = await LikesService.addLike(data);
        res.status(201).send({
          like_id: result,
          success: true,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },

  deleteLike: async (req, res) => {
    try {
      const userId = req.user.id;
      const data = req.body;
      data.userId = userId;
      const result = await LikesService.deleteLike(data);
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

  getLikesByProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const result = await LikesService.getLikesByProduct(productId);
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
