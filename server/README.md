# Rental Application Backend

This is the backend server for the rental application built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a .env file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rent-app
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

5. Start MongoDB service on your machine

6. Run the development server:
   ```bash
   npm run dev
   ```

The server will start on http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Properties
- GET /api/properties - Get all properties
- GET /api/properties/:id - Get property by ID
- POST /api/properties - Create a new property (Protected)
- PUT /api/properties/:id - Update a property (Protected)
- DELETE /api/properties/:id - Delete a property (Protected)

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server

## Error Handling

The API uses standard HTTP response codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error 