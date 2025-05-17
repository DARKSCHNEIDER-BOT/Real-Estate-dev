const User = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFavoriteProperties = async (req, res) => {
  try {
    const properties = await User.getFavoriteProperties(req.params.id);
    res.json(properties);
  } catch (error) {
    console.error("Error getting favorite properties:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addFavoriteProperty = async (req, res) => {
  try {
    await User.addFavoriteProperty(req.params.id, req.body.propertyId);
    res.json({ message: "Property added to favorites" });
  } catch (error) {
    console.error("Error adding favorite property:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFavoriteProperty = async (req, res) => {
  try {
    await User.removeFavoriteProperty(req.params.id, req.params.propertyId);
    res.json({ message: "Property removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite property:", error);
    res.status(500).json({ message: "Server error" });
  }
};
