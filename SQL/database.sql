-- Create a table for admins
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create a table for users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create a table for lunch items
CREATE TABLE IF NOT EXISTS lunch_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create a table for user choices
CREATE TABLE IF NOT EXISTS user_choices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    username VARCHAR(50) NOT NULL,
    item_id INTEGER NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (item_id) REFERENCES lunch_items (id) ON DELETE CASCADE
);

-- Insert sample data into admins table
INSERT INTO admins (username, password) VALUES
('admin1', 'admin1password'),
('admin2', 'admin2password');

-- Insert sample data into users table
INSERT INTO users (username, password) VALUES
('user1', 'user1password'),
('user2', 'user2password'),
('user3', 'user3password'),
('user4', 'user4password');
