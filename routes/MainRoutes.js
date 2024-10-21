const express = require("express");
const router = express.Router();

router.use("/category", require("./CategoryRouter"));
router.use("/user", require("./UserRouter"));
router.use("/product", require("./ProductRouter"));
router.use("/order", require("./OrderRouter"));
router.use("/rate", require("./RatingRouter"));
router.use("/ad", require("./AdsRouter"));
router.use("/like", require("./LikesRouter"));

module.exports = router;
