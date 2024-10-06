const express = require("express");
const router = express.Router();
const {
  getLikesByUser,
  addLike,
  deleteLike,
  getLikesByProduct,
} = require("../controllers/LikesController");
const { jwtMiddleware } = require("../auth/auth");
const { managerValidation } = require("../middlewares/ManagerValidation");

router.use(jwtMiddleware);

router.get("/", getLikesByUser);
router.post("/", addLike);
router.delete("/", deleteLike);

router.use(managerValidation);

router.get("/", getLikesByProduct);

module.exports = router;
