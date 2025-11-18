 Digital Saathi – Your Smart Digital Literacy Coach

A comprehensive web + mobile responsive application aimed at improving digital literacy and financial awareness among Indian citizens.

## 🚀 Features

- **Interactive Learning Modules**: Learn about UPI, online banking, e-governance, cybersecurity, and investments
- **AI Chatbot Tutor**: Conversational assistant powered by OpenAI GPT
- **Gamification**: Earn points, unlock badges, and compete on leaderboards
- **Scam Awareness**: Real-time alerts and community-submitted scam stories
- **Investment Playground**: Visual simulators for understanding investments
- **Multilingual Support**: Available in 10+ Indian languages
- **Admin Panel**: Manage lessons, users, and content

👥 Team

Gubba Yasodhar

Lalit Aditya Yanala

Karthik Cherukuru

Keerthana Badavath

Sankalp Gurram


## 📁 Project Structure

```
MSC Hackathon/
├── frontend/          # React + TailwindCSS frontend
├── backend/           # Node.js + Express backend
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- React + Vite
- TailwindCSS
- Redux Toolkit
- React Router v6
- Recharts
- Framer Motion
- React Hook Form + Zod
- Lucide React

### Backend
- Node.js + Express.js
- MongoDB
- Firebase Authentication
- OpenAI GPT API

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Firebase project
- OpenAI API key

### Installation

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
FIREBASE_PROJECT_ID=your_firebase_project_id
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## 🎯 Core Modules

1. **Learning Modules**: Structured lessons with videos, infographics, and quizzes
2. **AI Chatbot**: Smart tutor for answering user queries
3. **Gamification**: Points, badges, and leaderboards
4. **Scam Alerts**: Real-time fraud awareness
5. **Investment Playground**: Interactive investment calculators
6. **Admin Panel**: Content and user management


