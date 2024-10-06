const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  addCategory,
  editCategory,
  deleteCategory,
} = require("../controllers/CategoryController");
const { getProductsByCategory } = require("../controllers/ProductController");
const { jwtMiddleware } = require("../auth/auth");
const { managerValidation } = require("../middlewares/ManagerValidation");
const { categoryUpload } = require("../middlewares/Upload");
const validate = require("../middlewares/ValidateRequest.js");
const {
  createCategoryValidator,
  editCategoryValidator,
} = require("../middlewares/validators/CategoryValidators");

// /////////////////////////////////////////////////////////////////////////

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/product/:id", getProductsByCategory);

router.use(jwtMiddleware);
router.use(managerValidation);

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

// error middlware and write next() in catch in controllers

module.exports = router;
