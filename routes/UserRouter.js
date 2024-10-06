const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  managerLogin,
  getUserById,
  getAllUsers,
  editUser,
  editBalance,
} = require("../controllers/UserController");
const { managerValidation } = require("../middlewares/ManagerValidation");
const { jwtMiddleware } = require("../auth/auth");
const { userUpload } = require("../middlewares/Upload.js");
const validate = require("../middlewares/ValidateRequest");
const {
  createUserValidator,
  updateUserValidator,
  updateBalanceValidator,
} = require("../middlewares/validators/UserValidators");

router.post(
  "/signup",
  userUpload.single("image"),
  validate(createUserValidator),
  registerUser
);
router.post("/login", loginUser);
router.post("/managerLogin", managerLogin);

router.use(jwtMiddleware);

router.put(
  "/edit",
  userUpload.single("image"),
  validate(updateUserValidator),
  editUser
);

router.use(managerValidation);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/balance/:id", validate(updateBalanceValidator), editBalance);

module.exports = router;
