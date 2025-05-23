const db = require("../config/db");
const bcrypt = require("bcrypt");

class User {
  static async create(user) {
    const { name, email, password, role } = user;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      `INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword, role || "user"],
    );

    return result.rows[0];
  }

  static async createSocialUser(user) {
    const { name, email, provider, providerId, role } = user;

    const result = await db.query(
      `INSERT INTO users (name, email, provider, provider_id, role) 
      VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, provider, role, created_at`,
      [name, email, provider, providerId, role || "user"],
    );

    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async findByProviderId(provider, providerId) {
    const result = await db.query(
      "SELECT * FROM users WHERE provider = $1 AND provider_id = $2",
      [provider, providerId],
    );
    return result.rows[0];
  }

  static async linkSocialAccount(userId, provider, providerId) {
    const result = await db.query(
      `UPDATE users 
      SET provider = $1, provider_id = $2, updated_at = NOW() 
      WHERE id = $3 RETURNING id, name, email, provider, role, created_at`,
      [provider, providerId, userId],
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      "SELECT id, name, email, role, provider, created_at FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await db.query(
      "SELECT id, name, email, role, provider, created_at FROM users ORDER BY created_at DESC",
    );
    return result.rows;
  }

  static async update(id, userData) {
    const { name, email, role } = userData;

    const result = await db.query(
      `UPDATE users 
      SET name = $1, email = $2, role = $3, updated_at = NOW() 
      WHERE id = $4 RETURNING id, name, email, role, created_at`,
      [name, email, role, id],
    );

    return result.rows[0];
  }

  static async delete(id) {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
    return { id };
  }

  static async updatePassword(id, password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2",
      [hashedPassword, id],
    );

    return true;
  }

  static async addFavoriteProperty(userId, propertyId) {
    await db.query(
      "INSERT INTO user_favorites (user_id, property_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, propertyId],
    );
    return true;
  }

  static async removeFavoriteProperty(userId, propertyId) {
    await db.query(
      "DELETE FROM user_favorites WHERE user_id = $1 AND property_id = $2",
      [userId, propertyId],
    );
    return true;
  }

  static async getFavoriteProperties(userId) {
    const result = await db.query(
      `SELECT p.* FROM properties p 
      JOIN user_favorites uf ON p.id = uf.property_id 
      WHERE uf.user_id = $1 
      ORDER BY uf.created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  static async getUserRegistrationStats() {
    const result = await db.query(
      `SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN provider = 'Google' THEN 1 END) as google_users,
        COUNT(CASE WHEN provider = 'Apple' THEN 1 END) as apple_users,
        COUNT(CASE WHEN provider = 'Facebook' THEN 1 END) as facebook_users,
        COUNT(CASE WHEN provider IS NULL THEN 1 END) as email_users,
        DATE_TRUNC('day', created_at) as registration_date
      FROM users
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY registration_date DESC
      LIMIT 30`,
    );
    return result.rows;
  }
}

module.exports = User;
