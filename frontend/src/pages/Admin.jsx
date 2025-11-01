import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { Users, BookOpen, AlertTriangle, BarChart3, Plus } from 'lucide-react';

const Admin = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [statsData, usersData, lessonsData] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/lessons'),
      ]);
      setStats(statsData.data);
      setUsers(usersData.data);
      setLessons(lessonsData.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <BookOpen className="w-8 h-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold">{stats.totalLessons}</div>
            <div className="text-sm text-gray-600">Lessons</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold">{stats.totalScams}</div>
            <div className="text-sm text-gray-600">Scam Reports</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold">{stats.pendingScams}</div>
            <div className="text-sm text-gray-600">Pending Reviews</div>
          </div>
        </div>
      )}

      {/* Recent Users */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Points</th>
                <th className="text-left py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 10).map((u) => (
                <tr key={u._id} className="border-b">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2 text-gray-600">{u.email}</td>
                  <td className="py-2">{u.points || 0}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lessons */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Lessons</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Lesson</span>
          </button>
        </div>
        <div className="space-y-2">
          {lessons.slice(0, 5).map((lesson) => (
            <div key={lesson._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold">{lesson.title}</h3>
                <p className="text-sm text-gray-600">{lesson.category}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                lesson.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {lesson.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;

