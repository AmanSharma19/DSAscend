# DSAscend Backend

MERN stack backend for DSAscend Algorithm Visualizer.

## Technologies
- Node.js & Express
- MongoDB & Mongoose
- JWT for Authentication
- Bcryptjs for password hashing

## Getting Started

1. **Prerequisites**
   - Install MongoDB locally or have a MongoDB Atlas URI.
   - Install Node.js.

2. **Installation**
   ```bash
   cd backend
   npm install
   ```

3. **Configuration**
   Create a `.env` file in the root of the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dsascend
   JWT_SECRET=your_jwt_secret
   ```

4. **Running the Server**
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Log in to an existing account
