const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  addCategory,
  editCategory,
  deleteCategory,
  getAllAllCategories,
} = require("../controllers/CategoryController");
const { getProductsByCategory } = require("../controllers/ProductController");
const { jwtMiddleware } = require("../auth/auth");
const { managerValidation } = require("../middlewares/ManagerValidation");
const { categoryUpload } = require("../middlewares/UploadPath.js");
const validate = require("../middlewares/ValidateRequest.js");
const {
  createCategoryValidator,
  editCategoryValidator,
} = require("../middlewares/validators/CategoryValidators");

// cahing
const apicache = require("apicache");
const cache = apicache.middleware;
// /////////////////////////////////////////////////////////////////////////

router.get("/", cache("2 minutes"), getAllCategories);
router.get("/:id", getCategoryById);
router.get("/product/:id", cache("2 minutes"), getProductsByCategory);

router.use(jwtMiddleware);
router.use(managerValidation);

router.get("/all", getAllAllCategories);
router.post(
  "/",
  categoryUpload.single("image"),
  validate(createCategoryValidator),
  addCategory
);
router.put(
  "/:id",
  categoryUpload.single("image"),
  validate(editCategoryValidator),
  editCategory
);
router.delete("/:id", deleteCategory);

module.exports = router;
