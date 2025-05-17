const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/property.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Public routes
router.get("/", propertyController.getAllProperties);
router.get("/search", propertyController.searchProperties);
router.get("/:id", propertyController.getPropertyById);

// Protected routes (admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  propertyController.createProperty,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  propertyController.updateProperty,
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  propertyController.deleteProperty,
);

module.exports = router;
