# 🚀 Quick Start Guide

## 1. Setup Backend (5 minutes)

```bash
cd backend
npm install

# Create .env file (or use default MongoDB local)
# MONGODB_URI=mongodb://localhost:27017/digital-saathi
# JWT_SECRET=your_secret_key
# OPENAI_API_KEY=your_key (optional for chatbot)

# Seed demo data
npm run seed

# Start server
npm run dev
```

✅ Backend running on http://localhost:5000

## 2. Setup Frontend (3 minutes)

```bash
cd frontend
npm install

# Create .env file
# VITE_API_URL=http://localhost:5000/api

# Start dev server
npm run dev
```

✅ Frontend running on http://localhost:5173

## 3. Test the App

1. **Register** a new account at http://localhost:5173/register
2. **Browse lessons** at http://localhost:5173/learn
3. **Complete a lesson** and take the quiz
4. **Chat with AI** tutor at http://localhost:5173/chat
5. **Check leaderboard** at http://localhost:5173/rewards
6. **Calculate investments** at http://localhost:5173/investments

## 4. Create Admin User

After registering a user, update their role in MongoDB:

```javascript
// MongoDB Shell
use digital-saathi
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Then access admin panel at http://localhost:5173/admin

## 🎯 Key Features to Demo

- ✅ **Learning Modules**: Browse and complete lessons
- ✅ **AI Chatbot**: Ask questions about digital literacy
- ✅ **Quizzes**: Test your knowledge
- ✅ **Gamification**: Earn points and badges
- ✅ **Leaderboard**: Compete with others
- ✅ **Scam Alerts**: Report and view scams
- ✅ **Investment Calculator**: Plan your finances

## 📱 Mobile Responsive

The app is fully responsive! Open on mobile browser or resize your window to see mobile UI with bottom navigation.

## ⚠️ Troubleshooting

**MongoDB not running?**
- Install MongoDB locally OR
- Use MongoDB Atlas (free) and update MONGODB_URI

**OpenAI Chatbot not working?**
- Add OPENAI_API_KEY to backend/.env
- Or chatbot will show error messages (graceful degradation)

**Port already in use?**
- Change PORT in backend/.env
- Or kill the process: `lsof -ti:5000 | xargs kill`

## 🎉 You're Ready!

The app includes:
- 5 demo lessons
- 3 quizzes
- Complete UI/UX
- All core features working

Happy coding! 🚀

