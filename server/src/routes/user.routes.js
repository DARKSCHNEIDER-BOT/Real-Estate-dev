const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Admin routes
router.get("/", protect, authorize("admin"), userController.getAllUsers);
router.get("/:id", protect, authorize("admin"), userController.getUserById);
router.put("/:id", protect, authorize("admin"), userController.updateUser);
router.delete("/:id", protect, authorize("admin"), userController.deleteUser);

// User favorites routes
router.get("/:id/favorites", protect, userController.getFavoriteProperties);
router.post("/:id/favorites", protect, userController.addFavoriteProperty);
router.delete(
  "/:id/favorites/:propertyId",
  protect,
  userController.removeFavoriteProperty,
);

module.exports = router;
