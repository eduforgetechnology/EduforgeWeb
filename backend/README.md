# E-Learning Platform Backend

This is the backend API for the E-Learning Platform application. It handles user authentication, course management, and student enrollment.

## Table of Contents
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Database](#database)

## Setup

### Local Development
1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file in the root directory (see [Environment Variables](#environment-variables))
4. Start the server
   ```
   npm run dev
   ```

### Production
```
npm run prod
```

## Environment Variables

Create a `.env` file with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development  # Change to 'production' for deployment

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/elearning  # Use your MongoDB connection string

# Authentication
JWT_SECRET=your_secure_jwt_secret_key_change_this_in_production
JWT_EXPIRE=30d

# CORS Configuration (update this when deploying)
CORS_ORIGIN=http://localhost:3000  # Use your frontend URL in production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile (requires auth token)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a single course
- `POST /api/courses` - Create a new course (educators only)
- `PUT /api/courses/:id` - Update a course (educators only)
- `DELETE /api/courses/:id` - Delete a course (educators only)
- `GET /api/courses/enrolled` - Get enrolled courses (students only)
- `POST /api/courses/:id/enroll` - Enroll in a course (students only)

## Deployment

### Heroku Deployment
1. Create a Heroku account
2. Install the Heroku CLI
3. Log in to Heroku
   ```
   heroku login
   ```
4. Create a new Heroku app
   ```
   heroku create your-app-name
   ```
5. Set environment variables
   ```
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://your-frontend-url.com
   ```
6. Push to Heroku
   ```
   git push heroku main
   ```

### MongoDB Atlas
1. Create a cluster on MongoDB Atlas
2. Add your IP to the allowlist
3. Create a database user
4. Get your connection string and add it to your environment variables

## Database

The application uses MongoDB and has two main models:

### User Model
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- role: String (enum: 'student', 'educator', default: 'student')
- imageUrl: String

### Course Model
- title: String (required)
- description: String (required)
- imageUrl: String
- educator: ObjectId (reference to User)
- lessons: Array of { title: String, content: String }
- students: Array of ObjectId (reference to User)