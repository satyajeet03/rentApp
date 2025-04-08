# Rental Application

A full-stack application for room and flat rentals where house owners can list their properties and users can connect with them.

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Redux Toolkit
  - Material-UI (MUI)
  - React Query
  - Axios

- Backend:
  - Node.js
  - Express
  - TypeScript
  - MongoDB
  - JWT Authentication

## Project Structure

```
rentApp/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── features/      # Feature-specific components and logic
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store configuration
│   │   ├── types/         # TypeScript types/interfaces
│   │   └── utils/         # Utility functions
│   └── package.json
│
└── server/                 # Backend Node.js application
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── models/        # Database models
    │   ├── routes/        # API routes
    │   ├── middleware/    # Custom middleware
    │   ├── config/        # Configuration files
    │   └── utils/         # Utility functions
    └── package.json
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm start
   ```

## Features

- User Authentication (Owner/Tenant)
- Property Listing
- Property Search and Filtering
- Property Details View
- Contact Owner
- User Dashboard
- Property Management 