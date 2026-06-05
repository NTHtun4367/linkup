# LinkUp - Modern Messaging App

A full-stack messaging application built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Register, login, and logout with JWT tokens and HTTP-only cookies.
- **Contact List**: View all registered users (excluding yourself).
- **Chat List**: View users you've had conversations with.
- **Real-time Messaging**: Send and receive text messages.
- **Dark/Light Mode**: Toggle between themes.
- **Profile Images**: Upload and view profile pictures (via Cloudinary).
- **Security**: Protected endpoints, input validation, and Arcjet bot/rate limit protection.

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Redux Toolkit (with RTK Query)
- Tailwind CSS
- ShadCN UI Components
- Sonner (toast notifications)
- Lucide React (icons)

### Backend
- Node.js
- Express
- TypeScript
- MongoDB (with Mongoose)
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- Cloudinary (image uploads)
- Resend (welcome emails)
- Arcjet (security & bot protection)


## Project Structure

```
linkup/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components (Chat, Login, Register)
│   │   ├── layouts/       # Main layout
│   │   ├── store/         # Redux store, slices, and RTK Query
│   │   ├── types/         # TypeScript type definitions
│   │   └── schema/        # Zod validation schemas
├── server/                # Backend (Express + Node)
│   ├── src/
│   │   ├── controllers/   # Route logic
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Authentication, validation, error handling
│   │   └── utils/         # Helper functions (env, cloudinary, etc.)
```

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login existing user.
- `POST /api/auth/logout`: Logout user and clear cookie.
- `GET /api/auth/me`: Get current user's profile.
- `PUT /api/auth/update-profile`: Update user's profile image.

### Messages
- `GET /api/messages/contacts`: Get all users (contacts).
- `GET /api/messages/chats`: Get users you've chatted with.
- `GET /api/messages/:id`: Get messages with a specific user.
- `POST /api/messages/send/:id`: Send message to a specific user.
