import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { userService } from '../services/userService';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, TrendingUp, Users } from 'lucide-react';

const Rewards = () => {
  const { user } = useSelector((state) => state.auth);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [leaderboardData, statsData] = await Promise.all([
        userService.getLeaderboard({ limit: 10 }).catch(() => []),
        userService.getStats().catch(() => null),
      ]);
      setLeaderboard(leaderboardData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Rewards & Leaderboard</h1>

      {/* User Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <Trophy className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold">{stats.totalPoints}</div>
            <div className="text-sm opacity-90">Total Points</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <Star className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold">{stats.badgesCount}</div>
            <div className="text-sm opacity-90">Badges</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <Award className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold">{stats.lessonsCompleted}</div>
            <div className="text-sm opacity-90">Lessons</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <TrendingUp className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold">{stats.averageQuizScore}%</div>
            <div className="text-sm opacity-90">Quiz Avg</div>
          </div>
        </div>
      )}

      {/* Badges */}
      {user?.badges && user.badges.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Your Badges</h2>
          <div className="flex flex-wrap gap-4">
            {user.badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg"
              >
                🏆
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">Top Performers</h2>
        </div>
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <motion.div
              key={player._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-lg ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0
                      ? 'bg-yellow-400 text-white'
                      : index === 1
                      ? 'bg-gray-300 text-gray-700'
                      : index === 2
                      ? 'bg-orange-400 text-white'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold">{player.name}</div>
                  <div className="text-sm text-gray-500">{player.level}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-lg">{player.points}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rewards;

