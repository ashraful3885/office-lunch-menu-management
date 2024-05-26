Lunch Management System
Description
This project is a lunch management system that allows administrators to manage lunch items and view user choices. Users can select items for lunch, and administrators can add/delete lunch items and view user choices.

Features
Admin Dashboard: Allows administrators to add/delete lunch items and view user choices.
User Dashboard: Allows users to select lunch items.

Technologies Used
Frontend: React.js
Backend: Node.js, Express.js
Database: PostgreSQL
Authentication: JSON Web Tokens (JWT)

Setup Instructions
Clone the repository and navigate to the project directory.
After that install dependencies for the backend: npm install

Set up the PostgreSQL database:
Create a new database named menuManagement.
Execute the SQL script provided in database.sql to create the necessary tables.

Configure the backend:
Create a .env file in the root directory of the backend.
Add the following environment variables to the .env file:
PORT=your_databse_port
DB_USER=your_database_username
DB_PASSWORD=your_database_password

Start the backend server: npm start

Navigate to the frontend directory: cd frontend
Install dependencies for the frontend: npm install
Start the frontend server: npm start

API Endpoints
Admin Login: POST /api/admin/login
User Login: POST /api/user/login
Add Lunch Item: POST /api/lunch-items
Get Lunch Items: GET /api/lunch-items
Delete Lunch Item: DELETE /api/lunch-items/:id
Select Lunch Item: POST /api/user/select-item
Get User Choices: GET /api/user-choices

Usage
Admin Dashboard: Accessible at "/admin/dashboard". Login with admin credentials to manage lunch items and view user choices.
User Dashboard: Accessible at "/". Login with user credentials to select lunch items.
