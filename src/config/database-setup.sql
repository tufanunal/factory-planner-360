
-- Database setup script for Factory Planner
-- Run this script to create the necessary database structure

-- Create tables
CREATE TABLE IF NOT EXISTS machines (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50),
  availability INTEGER,
  hourlyCost DECIMAL(10, 2),
  labourPersonHour DECIMAL(10, 2),
  category VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS parts (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  unit VARCHAR(50),
  cycle_time INTEGER,
  pieces_per_cycle INTEGER
);

CREATE TABLE IF NOT EXISTS consumables (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  unit VARCHAR(50),
  unit_cost DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS raw_materials (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  unit VARCHAR(50),
  unit_cost DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS part_consumables (
  part_id VARCHAR(36) NOT NULL,
  consumable_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2),
  PRIMARY KEY (part_id, consumable_id),
  FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE CASCADE,
  FOREIGN KEY (consumable_id) REFERENCES consumables(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS part_raw_materials (
  part_id VARCHAR(36) NOT NULL,
  raw_material_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2),
  PRIMARY KEY (part_id, raw_material_id),
  FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE CASCADE,
  FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS calendar_state (
  id INTEGER PRIMARY KEY,
  data JSONB
);

CREATE TABLE IF NOT EXISTS categories (
  type VARCHAR(20) PRIMARY KEY,
  categories JSONB
);

CREATE TABLE IF NOT EXISTS units (
  id INTEGER PRIMARY KEY,
  units JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_machines_category ON machines(category);
CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(category);
CREATE INDEX IF NOT EXISTS idx_part_consumables_part_id ON part_consumables(part_id);
CREATE INDEX IF NOT EXISTS idx_part_raw_materials_part_id ON part_raw_materials(part_id);

-- Insert default data if needed
INSERT INTO categories (type, categories)
VALUES ('machine', '["CNC", "Assembly", "Packaging", "Quality Control"]')
ON CONFLICT (type) DO NOTHING;

INSERT INTO categories (type, categories)
VALUES ('part', '["Electronics", "Hardware", "Structural", "Default"]')
ON CONFLICT (type) DO NOTHING;

INSERT INTO units (id, units)
VALUES (1, '["pcs", "kg", "liters", "meters", "hours"]')
ON CONFLICT (id) DO NOTHING;

-- Instructions for production setup:
/*
1. Create a PostgreSQL database named 'factoryplanner' (or your preferred name)
2. Run this script to create the necessary tables and indexes
3. Update the database configuration in src/config/database.ts with your production credentials
4. Set USE_POSTGRES=true in your environment variables
*/
