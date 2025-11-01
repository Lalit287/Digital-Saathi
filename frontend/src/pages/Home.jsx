import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { BookOpen, Shield, TrendingUp, AlertTriangle, MessageCircle, Trophy } from 'lucide-react';

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  const categories = [
    { icon: BookOpen, title: 'Learning Modules', desc: 'Learn about UPI, banking & more', link: '/learn', color: 'bg-blue-500' },
    { icon: Shield, title: 'Scam Alerts', desc: 'Stay safe from frauds', link: '/scams', color: 'bg-red-500' },
    { icon: TrendingUp, title: 'Investments', desc: 'Plan your financial future', link: '/investments', color: 'bg-green-500' },
    { icon: MessageCircle, title: 'AI Tutor', desc: 'Get instant answers', link: '/chat', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">नमस्ते! Welcome to Digital Saathi</h1>
        <p className="text-blue-100 mb-4">
          {user ? `Hello ${user.name}! Ready to learn today?` : 'Your Smart Digital Literacy Coach'}
        </p>
        {user && (
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-sm opacity-90">Your Points</div>
              <div className="text-2xl font-bold">{user.points || 0}</div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-sm opacity-90">Level</div>
              <div className="text-2xl font-bold">{user.level || 'Beginner'}</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={category.link}
                className={`${category.color} rounded-xl p-6 text-white block hover:shadow-lg transition`}
              >
                <Icon className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-1">{category.title}</h3>
                <p className="text-sm opacity-90">{category.desc}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Why Digital Saathi?</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Interactive Learning</h3>
              <p className="text-sm text-gray-600">Learn through videos, quizzes, and practical examples</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Earn Rewards</h3>
              <p className="text-sm text-gray-600">Complete lessons and earn points, badges, and unlock achievements</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 rounded-full p-2">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">AI-Powered Help</h3>
              <p className="text-sm text-gray-600">Get instant answers to your questions in multiple languages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

