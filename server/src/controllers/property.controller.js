const Property = require("../models/property.model");

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.getAll();
    res.json(properties);
  } catch (error) {
    console.error("Error getting properties:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.getById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    console.error("Error getting property:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.update(req.params.id, req.body);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    await Property.delete(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchProperties = async (req, res) => {
  try {
    const filters = req.query;
    const properties = await Property.search(filters);
    res.json(properties);
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({ message: "Server error" });
  }
};
