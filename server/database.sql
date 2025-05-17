-- Create database (run this separately)
-- CREATE DATABASE realestate;

-- Connect to the database
-- \c realestate

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'sale' or 'rent'
  property_type VARCHAR(50) NOT NULL, -- 'apartment', 'house', 'villa', etc.
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  description TEXT,
  amenities TEXT[], -- Array of amenities
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User favorites table (many-to-many relationship)
CREATE TABLE user_favorites (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, property_id)
);

-- Inquiries table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'responded', 'closed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_bathrooms ON properties(bathrooms);

-- Sample data for testing
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2b$10$rIC/ORGzjmYrRf0aL9G0S.VK9Mw1YD5EET1DF9CrQWi4ZJbTNnxFW', 'admin'), -- password: admin123
('Regular User', 'user@example.com', '$2b$10$rIC/ORGzjmYrRf0aL9G0S.VK9Mw1YD5EET1DF9CrQWi4ZJbTNnxFW', 'user'); -- password: admin123

INSERT INTO properties (title, price, location, type, property_type, bedrooms, bathrooms, area, image_url, description, amenities) VALUES
('Modern Apartment with City View', 350000, 'Downtown, New York', 'sale', 'apartment', 2, 2, 1200, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 'A beautiful modern apartment with stunning city views.', '{"pool", "gym", "parking"}'),
('Luxury Villa with Pool', 1200000, 'Beverly Hills, Los Angeles', 'sale', 'villa', 5, 4, 3500, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', 'Luxurious villa with private pool and garden.', '{"pool", "garden", "security", "parking"}'),
('Cozy Studio in Historic District', 1500, 'French Quarter, New Orleans', 'rent', 'studio', 1, 1, 650, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 'Charming studio apartment in the heart of the historic district.', '{"balcony"}');
