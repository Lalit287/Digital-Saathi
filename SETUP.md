# Digital Saathi - Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB (local or Atlas)
- OpenAI API key (optional, for chatbot)
- Git

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file (copy from .env.example)
# Add your MongoDB URI and API keys

# Start MongoDB (if using local)
# mongod

# Run seed script to populate demo data
npm run seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install

# Create .env file with:
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/digital-saathi
JWT_SECRET=your_jwt_secret_key_change_in_production
OPENAI_API_KEY=your_openai_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Creating an Admin User

After seeding, you can create an admin user through the API or MongoDB:

```javascript
// Using MongoDB shell
use digital-saathi
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or register a user and update their role manually.

## Features Included

✅ Interactive Learning Modules
✅ AI Chatbot (requires OpenAI API key)
✅ Quiz System
✅ Gamification (Points, Badges, Leaderboard)
✅ Scam Alert Feed
✅ Investment Calculator
✅ Admin Dashboard
✅ User Authentication
✅ Progress Tracking

## Demo Data

The seed script creates:
- 5 sample lessons (UPI, Phishing, Aadhaar, Banking, SIP)
- 3 quizzes
- 3 reward badges

## Troubleshooting

1. **MongoDB Connection Error**: Ensure MongoDB is running or update MONGODB_URI
2. **OpenAI API Errors**: Chatbot will show error messages if API key is invalid
3. **CORS Errors**: Check FRONTEND_URL in backend .env matches your frontend URL
4. **Port Already in Use**: Change PORT in backend .env or kill the process using that port

## Production Deployment

### Backend (Render/Firebase)
- Set environment variables
- Update CORS settings
- Use MongoDB Atlas for database

### Frontend (Vercel)
- Update VITE_API_URL to production backend URL
- Build: `npm run build`
- Deploy the `dist` folder

## Next Steps

1. Add more lessons through admin panel
2. Customize UI colors and branding
3. Add more languages (i18n)
4. Integrate Firebase Authentication
5. Add push notifications
6. Implement volunteer features

