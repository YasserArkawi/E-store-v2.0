const express = require("express");
const router = express.Router();
const {
  makeNewOrder,
  getAllOrders,
  getOrdersByUserId,
  deleteOrder,
  manageOrder,
} = require("../controllers/OrderController");
const {
  createOrderValidator,
  deleteOrdersValidator,
  manageOrdersValidator,
} = require("../middlewares/validators/OrderValidators");
const validate = require("../middlewares/ValidateRequest");
const { jwtMiddleware } = require("../auth/auth");
const { managerValidation } = require("../middlewares/ManagerValidation");
const enumMiddleware = require("../middlewares/Helper");

router.use(enumMiddleware);
router.use(jwtMiddleware);
router.post("/", validate(createOrderValidator), makeNewOrder);
router.get("/byUser/:id", getOrdersByUserId);
router.delete("/", validate(deleteOrdersValidator), deleteOrder);

router.use(managerValidation);
router.get("/", getAllOrders);
router.put("/manage/:id", validate(manageOrdersValidator), manageOrder);
// router.get("/payment", getAllOrders);

module.exports = router;
