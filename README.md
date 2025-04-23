# Kehila Krova - קהילה קרובה

A community-driven marketplace application that connects people locally for sharing products, job listings, consultations, and help requests.

![Kehila Krova Logo](./assets/icon.png)

## 📱 Overview

Kehila Krova ("Nearby Community" in Hebrew) is a mobile application built with React Native and Expo, with a Node.js/Express backend. The app helps users find and share resources within their local community.

## ✨ Features

- **Interactive Map**: View nearby listings based on your location
- **Products Marketplace**: Buy and sell items within your community
- **Job Board**: Find and post job opportunities
- **Community Consultations**: Ask questions and get advice from neighbors
- **Help Requests**: Request and offer assistance in your area
- **User Profiles**: Personalized experience with saved favorites and history
- **Location-based Matching**: Find items within your preferred radius
- **Category Filtering**: Browse by different categories
- **Analytics**: Track usage patterns to improve recommendations

## 🛠️ Tech Stack

### Frontend (Mobile)
- **React Native**: Core framework for cross-platform mobile development
- **Expo**: Development workflow and additional native APIs
- **React Navigation**: App navigation and routing
- **AsyncStorage**: Local data persistence
- **TypeScript**: Type-safe JavaScript

### Backend (Server)
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **MongoDB**: Database for storing user and product information
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication and authorization
- **Multer**: File uploads handling

## 📦 Project Structure

```
├── src/                        # Source files
│   ├── components/             # Reusable UI components
│   ├── contexts/               # React Context API providers
│   ├── hooks/                  # Custom React hooks
│   ├── navigation/             # Navigation configuration
│   ├── screens/                # Screen components
│   │   ├── auth/               # Authentication screens
│   │   ├── community/          # Community screens
│   │   ├── consultations/      # Consultation screens
│   │   ├── home/               # Home and profile screens
│   │   ├── jobs/               # Job-related screens
│   │   └── marketplace/        # Marketplace screens
│   ├── services/               # Service layer
│   ├── styles/                 # Shared styles
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
├── assets/                     # Static assets like images
├── models/                     # Database models
├── routes/                     # Express routes
├── middleware/                 # Express middleware
├── app.ts                      # Express app configuration
├── server.ts                   # Server entry point
├── app.json                    # Expo configuration
└── package.json                # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/kehila-krova.git
   cd kehila-krova
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/kehila
   JWT_SECRET=yoursecretkey
   MAX_LOGIN_ATTEMPTS=5
   LOCATION_RADIUS_DEFAULT=5000
   NODE_ENV=development

   ```

4. Start the development server
   ```bash
   # Start the backend server
   npm run dev
   
   # In a new terminal, start the Expo development server
   expo start
   ```

## 📝 API Documentation

### Authentication

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login a user

### Products

- `GET /products`: Get all products
- `GET /products/:id`: Get product by ID
- `POST /products/add`: Add a new product
- `PUT /products/:id`: Update a product
- `DELETE /products/:id`: Delete a product

### Jobs

- `GET /jobs`: Get all jobs
- `GET /jobs/filter`: Get filtered jobs
- `GET /jobs/:id`: Get job by ID
- `POST /jobs`: Add a new job
- `PUT /jobs/:id`: Update a job
- `DELETE /jobs/:id`: Delete a job

### Consultations

- `GET /consultations`: Get all consultations
- `POST /consultations`: Create a new consultation
- `POST /consultations/:id/answers`: Add an answer to a consultation
- `POST /consultations/:consultationId/answers/:answerId/like`: Like an answer

### Users

- `POST /users/update-location`: Update user location

### Categories

- `GET /categories`: Get all categories
- `POST /categories`: Create a new category

### Analytics

- `POST /analytics/events`: Update user analytics
- `GET /analytics/user/:userId`: Get user analytics

## 📱 Mobile Features

- **Map View**: Displays nearby products, jobs, and help requests
- **Search and Filters**: Find items by category, distance, and more
- **User Profiles**: View and edit your profile
- **Favorites and History**: Keep track of items you like
- **Real-time Location**: Update your location to see nearby listings
- **Multi-language Support**: Hebrew and English interfaces

## 🔒 Security Features

- JWT authentication for secure API access
- Password hashing
- Protected routes
- Input validation

## 📊 Analytics

The app includes analytics tracking to improve user experience:
- Screen views
- Search patterns
- Item interactions
- Location changes
- User behavior

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Paz Tabachnik - [GitHub](https://github.com/PazTaba)

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
