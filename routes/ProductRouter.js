const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  editProduct,
  deleteProduct,
  getMostRatedProducts,
  getProductById,
  getAllAllProducts,
} = require("../controllers/ProductController");
const { jwtMiddleware } = require("../auth/auth");
const { managerValidation } = require("../middlewares/ManagerValidation");

const {
  createProductsValidator,
  updateProductsValidator,
  deleteProductsValidator,
} = require("../middlewares/validators/ProductValidators");
const validate = require("../middlewares/ValidateRequest");

const { productUpload } = require("../middlewares/Upload");

// //////////////////////////////////////////////////////////

router.get("/", getAllProducts);
router.get("/mostRated", getMostRatedProducts);
router.get("/:id", getProductById);

router.use(jwtMiddleware);
router.use(managerValidation);

router.get("/all", getAllAllProducts);

router.post(
  "/",
  productUpload.single("image"),
  validate(createProductsValidator),
  addProduct
);
router.put(
  "/:id",
  productUpload.single("image"),
  validate(updateProductsValidator),
  editProduct
);
router.delete("/", validate(deleteProductsValidator), deleteProduct);

module.exports = router;
