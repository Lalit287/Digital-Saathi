import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLessons, setLoading, setFilter } from '../store/slices/lessonSlice';
import { lessonService } from '../services/lessonService';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, CheckCircle } from 'lucide-react';

const Learn = () => {
  const dispatch = useDispatch();
  const { lessons, loading, filter } = useSelector((state) => state.lessons);
  const { user } = useSelector((state) => state.auth);
  const [categories] = useState(['All', 'Banking', 'UPI', 'E-Governance', 'Cybersecurity', 'Finance', 'Scam Prevention']);

  useEffect(() => {
    loadLessons();
  }, [filter]);

  const loadLessons = async () => {
    dispatch(setLoading(true));
    try {
      const data = await lessonService.getAll(filter);
      dispatch(setLessons(data));
    } catch (error) {
      console.error('Failed to load lessons:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const isLessonCompleted = (lessonId) => {
    if (!user) return false;
    return user.completedLessons?.some(cl => cl.lessonId === lessonId);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Banking': 'bg-blue-100 text-blue-800',
      'UPI': 'bg-green-100 text-green-800',
      'E-Governance': 'bg-purple-100 text-purple-800',
      'Cybersecurity': 'bg-red-100 text-red-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Scam Prevention': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 -mx-4 md:-mx-6">
      <div className="px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-2">Learning Modules</h1>
        <p className="text-gray-600">Choose a topic to start learning</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 px-4 md:px-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => dispatch(setFilter({ category: cat === 'All' ? null : cat }))}
            className={`px-4 py-2 rounded-full transition ${
              (cat === 'All' && !filter.category) || filter.category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lessons...</p>
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No lessons found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-lg md:rounded-none">
          {lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson._id);
            const isLastRow = index >= lessons.length - (lessons.length % 2 === 0 ? 2 : 1);
            const isRightColumn = index % 2 === 1;
            return (
              <motion.div
                key={lesson._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-r border-b border-gray-200 ${
                  isLastRow ? 'border-b-0' : ''
                } ${isRightColumn ? 'md:border-r-0' : ''}`}
              >
                <Link
                  to={`/learn/${lesson._id}`}
                  className="bg-white hover:bg-gray-50 transition block relative overflow-hidden h-full"
                >
                  {completed && (
                    <div className="absolute top-4 right-4 z-10">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                  
                  {/* Lesson Image/Thumbnail */}
                  {lesson.imageUrl && (
                    <div className="w-full h-48 bg-gray-200 overflow-hidden border-b border-gray-200">
                      <img
                        src={lesson.imageUrl}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(lesson.category)}`}>
                        {lesson.category}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {lesson.difficulty}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lesson.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{lesson.pointsReward} pts</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Learn;

