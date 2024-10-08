const express = require("express");
const router = express.Router();
const {
  addRate,
  getRateByProduct,
  deleteRatesByUser,
  deleteRatesByProduct,
  deleteRate,
} = require("../controllers/RatingController");
const { jwtMiddleware } = require("../auth/auth");
const { managerValidation } = require("../middlewares/ManagerValidation");
const validate = require("../middlewares/ValidateRequest");
const {
  createRateValidator,
} = require("../middlewares/validators/RatingValidators");

router.get("/:id", getRateByProduct);

router.use(jwtMiddleware);
router.post("/", validate(createRateValidator), addRate);
// router.delete("/:id", deleteRate);

router.use(managerValidation);
router.delete("/byUser/:id", deleteRatesByUser);
router.delete("/byProduct/:id", deleteRatesByProduct);

module.exports = router;
