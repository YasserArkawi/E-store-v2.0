const express = require("express");
const router = express.Router();
const {
  makeNewOrder,
  getAllOrders,
  getOrdersByUserId,
  deleteOrder,
  manageOrder,
  getAllAllOrders,
} = require("../controllers/OrderController");
const {
  createOrderValidator,
  deleteOrdersValidator,
  manageOrdersValidator,
} = require("../middlewares/validators/OrderValidators");
const validate = require("../middlewares/ValidateRequest");
const { jwtMiddleware } = require("../auth/auth");
const { managerValidation } = require("../middlewares/ManagerValidation");
const { paymentEnumMiddleware } = require("../middlewares/PaymentEnum");

////////////////////////////////////////////////////////////////////////////////////////

router.use(paymentEnumMiddleware);
router.use(jwtMiddleware);

router.post("/", validate(createOrderValidator), makeNewOrder);
router.get("/byUser/:id", getOrdersByUserId);
router.delete("/", validate(deleteOrdersValidator), deleteOrder);

router.use(managerValidation);

router.get("/", getAllOrders);
router.get("/all", getAllAllOrders);
router.put("/manage/:paymentId", validate(manageOrdersValidator), manageOrder);
// router.get("/payment", getAllOrders);

module.exports = router;
