const OrderService = require("../services/OrderService");
const sendEmail = require("../helper/SendMail");
module.exports = {
  makeNewOrder: async (req, res) => {
    try {
      const data = req.body;
      data.userId = req.user.id;
      const result = await OrderService.makeNewOrder(data);
      await sendEmail(
        result.userEmail,
        "Order Made!",
        `Order made from user: ${result.userId}, Order Id: ${result.order.id}.
        Ordered products: 
        ${result.linkedOrders}.`
      );
      res.status(201).send({
        order: result.order,
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
  // editOrderByUserId: (req, res) => {
  //   try {
  //     const data = req.body;
  //     if (!data.user_id || !data.products) {
  //       res.status(400).send({ message: "Missing required data" });
  //     } else {
  //       const result = OrderService.editOrderByUserId1(data);
  //       result
  //         .then((result1) => {
  //           data.products.forEach((element) => {
  //             OrderService.editOrderByUserId2(result1, element.product_id)
  //               // .then((result2) => {})
  //               .catch((error) => {
  //                 return res.status(400).send({
  //                   data: error.message,
  //                   success: false,
  //                 });
  //               });
  //           });
  //           res.status(200).send({
  //             data: "Updated",
  //             success: true,
  //           });
  //         })
  //         .catch((error) => {
  //           res.status(400).send({
  //             data: error.message,
  //             success: false,
  //           });
  //         });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.status(400).send({
  //       data: error.message,
  //       success: false,
  //     });
  //   }
  // },

  getOrdersByUserId: async (req, res) => {
    try {
      const id = req.params.id;
      const results = await OrderService.getOrdersByUserId(id);
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

  deleteOrder: async (req, res) => {
    try {
      const id = req.user.id;
      const data = req.body;
      const result = await OrderService.deleteOrder(id, data.ids);
      await sendEmail(
        result.user.email,
        "Deleted Order!",
        `Order deleted from user: ${result.user.id}, Order Id: ${data.ids}.`
      );
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

  // manager /////////////////////////////////////////////////

  getAllOrders: async (req, res) => {
    try {
      const skip = +req.query.skip || undefined;
      const take = +req.query.take || undefined;
      const data = { skip, take };
      const result = await OrderService.getAllOrders(data);
      res.status(200).send({
        orders: result,
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

  getAllAllOrders: async (req, res) => {
    try {
      const skip = +req.query.skip || undefined;
      const take = +req.query.take || undefined;
      const data = { skip, take };
      const result = await OrderService.getAllAllOrders(data);
      res.status(200).send({
        orders: result,
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

  manageOrder: async (req, res) => {
    try {
      const data = req.body;
      data.paymentId = +req.params.paymentId;
      const result = await OrderService.manageOrder(data);
      if (result !== "Pending") {
        await sendEmail(
          result.userEmail,
          "Managed Order!",
          `Order managed from user: ${result.userId}, Order Id: ${result.payment.OrderId}, Status of the order: ${result.payment.status}, User balance: ${result.userBalance} `
        );
      }
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
