const db = require("../config/db");

class Property {
  static async getAll() {
    const result = await db.query(
      "SELECT * FROM properties ORDER BY created_at DESC",
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query("SELECT * FROM properties WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  static async create(property) {
    const {
      title,
      price,
      location,
      type,
      property_type,
      bedrooms,
      bathrooms,
      area,
      image_url,
    } = property;

    const result = await db.query(
      `INSERT INTO properties 
      (title, price, location, type, property_type, bedrooms, bathrooms, area, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        title,
        price,
        location,
        type,
        property_type,
        bedrooms,
        bathrooms,
        area,
        image_url,
      ],
    );

    return result.rows[0];
  }

  static async update(id, property) {
    const {
      title,
      price,
      location,
      type,
      property_type,
      bedrooms,
      bathrooms,
      area,
      image_url,
    } = property;

    const result = await db.query(
      `UPDATE properties 
      SET title = $1, price = $2, location = $3, type = $4, property_type = $5, 
      bedrooms = $6, bathrooms = $7, area = $8, image_url = $9, updated_at = NOW() 
      WHERE id = $10 RETURNING *`,
      [
        title,
        price,
        location,
        type,
        property_type,
        bedrooms,
        bathrooms,
        area,
        image_url,
        id,
      ],
    );

    return result.rows[0];
  }

  static async delete(id) {
    await db.query("DELETE FROM properties WHERE id = $1", [id]);
    return { id };
  }

  static async search(filters) {
    let query = "SELECT * FROM properties WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (filters.location) {
      query += ` AND location ILIKE $${paramIndex}`;
      params.push(`%${filters.location}%`);
      paramIndex++;
    }

    if (filters.propertyType) {
      query += ` AND property_type = $${paramIndex}`;
      params.push(filters.propertyType);
      paramIndex++;
    }

    if (filters.minPrice) {
      query += ` AND price >= $${paramIndex}`;
      params.push(filters.minPrice);
      paramIndex++;
    }

    if (filters.maxPrice) {
      query += ` AND price <= $${paramIndex}`;
      params.push(filters.maxPrice);
      paramIndex++;
    }

    if (filters.bedrooms) {
      query += ` AND bedrooms >= $${paramIndex}`;
      params.push(filters.bedrooms);
      paramIndex++;
    }

    if (filters.bathrooms) {
      query += ` AND bathrooms >= $${paramIndex}`;
      params.push(filters.bathrooms);
      paramIndex++;
    }

    query += " ORDER BY created_at DESC";

    const result = await db.query(query, params);
    return result.rows;
  }
}

module.exports = Property;
