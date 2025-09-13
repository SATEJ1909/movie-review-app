# 🎬 MovieReview App

A full-stack movie review application built with **React**, **TypeScript**, **Node.js**, and **MongoDB**. Discover movies, write reviews, and manage your personal watchlist with a beautiful, responsive interface.

![MovieReview App](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-19.1.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue) ![Node.js](https://img.shields.io/badge/Node.js-20.19%2B-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)

## ✨ Features

### 🎯 Core Functionality
- **🏠 Home Page** - Featured movies, trending films, and hero section
- **📋 Movie Listing** - Browse movies with advanced search and filtering
- **🎭 Movie Details** - Complete movie information, cast, trailers, and reviews
- **👤 User Profiles** - Personal dashboard with review history and statistics
- **❤️ Watchlist** - Save movies to watch later with easy management
- **⭐ Review System** - Write and read movie reviews with 5-star ratings
- **🔐 Authentication** - Secure user registration and login system

### 🎨 User Experience
- **📱 Responsive Design** - Perfect on desktop, tablet, and mobile
- **🌙 Modern UI** - Clean, intuitive interface with Tailwind CSS
- **⚡ Fast Performance** - Optimized loading with skeleton states
- **🔍 Smart Search** - Filter by genre, year, rating, and title
- **📄 Pagination** - Smooth browsing through large movie collections
- **🎪 Interactive Elements** - Hover effects, animations, and transitions

## 🚀 Quick Start

### Prerequisites

Before running this application, make sure you have:

- **Node.js** (v20.19+ or v22.12+) - [Download here](https://nodejs.org/)
- **MongoDB** - [Install locally](https://www.mongodb.com/docs/manual/installation/) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SATEJ1909/movie-review-app.git
   cd movie-review-app
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### ⚙️ Configuration

1. **Backend Configuration**
   
   Create a `.env` file in the `backend` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/moviereview
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moviereview
   
   # JWT Secret (use a strong, random string)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Server Port
   PORT=3000
   ```

2. **Frontend Configuration**
   
   The frontend is pre-configured to connect to `http://localhost:3000`. If you change the backend port, update the API base URL in `frontend/src/services/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://localhost:YOUR_PORT/api/v1';
   ```

### 🏃‍♂️ Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or next available port)

3. **Open your browser** and navigate to the frontend URL to start using the app!

## 📁 Project Structure

```
movie-review-app/
├── 📂 backend/                 # Node.js + Express API
│   ├── 📂 src/
│   │   ├── 📂 controllers/     # Request handlers
│   │   ├── 📂 models/         # MongoDB schemas
│   │   ├── 📂 routes/         # API routes
│   │   ├── 📂 middleware/     # Auth & validation
│   │   └── 📄 index.ts        # Server entry point
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
│
├── 📂 frontend/                # React + TypeScript UI
│   ├── 📂 src/
│   │   ├── 📂 components/     # Reusable UI components
│   │   ├── 📂 context/        # React Context (State)
│   │   ├── 📂 pages/          # Page components
│   │   ├── 📂 services/       # API integration
│   │   ├── 📂 types/          # TypeScript definitions
│   │   └── 📄 App.tsx         # Main app component
│   ├── 📄 package.json
│   ├── 📄 tailwind.config.js
│   └── 📄 vite.config.ts
│
└── 📄 README.md               # This file
```

## 🛠️ Technology Stack

### Frontend
- **⚛️ React 19.1.1** - Modern UI library with hooks
- **📘 TypeScript** - Type-safe JavaScript
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🚀 Vite** - Fast build tool and dev server
- **🧭 React Router** - Client-side routing
- **📡 Axios** - HTTP client for API calls
- **🎯 Lucide React** - Beautiful icon library

### Backend
- **🟢 Node.js** - JavaScript runtime
- **🚀 Express.js** - Web framework
- **📘 TypeScript** - Type-safe JavaScript
- **🍃 MongoDB** - NoSQL database
- **🔗 Mongoose** - MongoDB object modeling
- **🔐 JWT** - JSON Web Tokens for auth
- **🔒 bcrypt** - Password hashing
- **✅ Zod** - Schema validation

## 📋 API Endpoints

### Authentication
- `POST /api/v1/user/signup` - User registration
- `POST /api/v1/user/login` - User login
- `GET /api/v1/user/:id` - Get user profile
- `POST /api/v1/user/updateProfile` - Update profile

### Movies
- `GET /api/v1/movie/getMovies` - Get movies (with filters)
- `GET /api/v1/movie/getMoviebyId/:id` - Get movie details
- `POST /api/v1/movie/addMovie` - Add new movie (admin)
- `GET /api/v1/movie/:id/reviews` - Get movie reviews
- `POST /api/v1/movie/:id/review` - Add movie review

### Watchlist
- `GET /api/v1/user/:id/watchlist` - Get user watchlist
- `POST /api/v1/user/addtoWatchList` - Add to watchlist
- `POST /api/v1/user/removeFromWatchList` - Remove from watchlist

## 🎨 UI Components

### Layout Components
- **Navbar** - Navigation with search and user menu
- **Footer** - Site footer with links
- **Layout** - Main layout wrapper

### Movie Components
- **MovieCard** - Individual movie display
- **MovieGrid** - Responsive movie grid
- **MovieFilters** - Search and filter controls

### Review Components
- **ReviewForm** - Write new reviews
- **ReviewList** - Display movie reviews
- **StarRating** - Interactive 5-star rating

### UI Components
- **LoadingSpinner** - Loading states
- **ErrorMessage** - Error handling
- **ProtectedRoute** - Authentication wrapper

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run production server
```

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### 🐛 Troubleshooting

**Node.js Version Issues:**
- Ensure you have Node.js v20.19+ or v22.12+
- Use `node --version` to check your version

**MongoDB Connection:**
- Make sure MongoDB is running locally or check your Atlas connection string
- Verify the `MONGODB_URI` in your `.env` file

**Port Conflicts:**
- Backend default port: 3000
- Frontend default port: 5173
- Change ports in respective config files if needed

**Type Import Issues:**
- Use `import type { ... }` for TypeScript types
- This is required when `verbatimModuleSyntax` is enabled

## 🚀 Production Deployment

### Backend Deployment
1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, Vercel, DigitalOcean, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to a static hosting service (Netlify, Vercel, etc.)
3. Update API base URL for production



---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [SATEJ](https://github.com/SATEJ1909)

</div>

