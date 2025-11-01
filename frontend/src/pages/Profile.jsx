import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { userService } from '../services/userService';
import { Trophy, BookOpen, CheckCircle, TrendingUp, Settings } from 'lucide-react';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await userService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Set default stats if API call fails
      setStats({
        totalPoints: user?.points || 0,
        badgesCount: user?.badges?.length || 0,
        lessonsCompleted: user?.completedLessons?.length || 0,
        quizzesCompleted: 0,
        averageQuizScore: 0,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
            <p className="text-blue-100">{user?.email}</p>
            <div className="mt-2 flex items-center space-x-4">
              <div>
                <div className="text-sm opacity-90">Level</div>
                <div className="font-bold">{user?.level || 'Beginner'}</div>
              </div>
              <div>
                <div className="text-sm opacity-90">Points</div>
                <div className="font-bold">{user?.points || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold">Lessons Completed</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.lessonsCompleted}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold">Quizzes Taken</h3>
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.quizzesCompleted}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <h3 className="font-semibold">Total Points</h3>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.totalPoints}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold">Quiz Average</h3>
            </div>
            <div className="text-3xl font-bold text-purple-600">{stats.averageQuizScore}%</div>
          </div>
        </div>
      )}

      {/* Badges */}
      {user?.badges && user.badges.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Your Achievements</h2>
          <div className="flex flex-wrap gap-4">
            {user.badges.map((badge, index) => (
              <div
                key={index}
                className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl"
              >
                🏆
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

