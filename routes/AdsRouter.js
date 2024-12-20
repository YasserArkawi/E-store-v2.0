const express = require("express");
const router = express.Router();
const { jwtMiddleware } = require("../auth/auth");
const { managerValidation } = require("../middlewares/ManagerValidation");
const {
  addAd,
  getAllAds,
  deleteAd,
  updateAd,
  getAdById,
} = require("../controllers/AdsController");
const {
  createAdValidator,
  updateAdValidator,
  deleteAdValidator,
} = require("../middlewares/validators/AdsValidator");
const validate = require("../middlewares/ValidateRequest");
const { adUpload } = require("../middlewares/UploadPath");

// caching
const apicache = require("apicache");
const cache = apicache.middleware;
// ///////////////////////////////////////////////////////////////////////////////////

router.get("/", cache("2 minutes"), getAllAds);
router.get("/:id", getAdById);

router.use(jwtMiddleware);
router.use(managerValidation);

router.post("/", adUpload.single("file"), validate(createAdValidator), addAd);
router.delete("/", validate(deleteAdValidator), deleteAd);
router.put(
  "/:id",
  adUpload.single("image"),
  validate(updateAdValidator),
  updateAd
);

module.exports = router;
