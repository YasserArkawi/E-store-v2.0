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
  getRecommend,
  editImagesProduct,
  deleteImagesProduct,
  addImagesProduct,
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
router.get("/byId/:id", getProductById);
router.get("/recommend/:categoryId", getRecommend);

router.use(jwtMiddleware);
router.use(managerValidation);

router.get("/all", getAllAllProducts);

router.post(
  "/",
  productUpload.single("image"),
  validate(createProductsValidator),
  addProduct
);
router.put("/:id", validate(updateProductsValidator), editProduct);
router.post("/images/:id", productUpload.array("newImages"), addImagesProduct);
router.put("/images/:id", productUpload.array("newImages"), editImagesProduct);
router.delete("/images", deleteImagesProduct);
router.delete("/", validate(deleteProductsValidator), deleteProduct);

module.exports = router;
