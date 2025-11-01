import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { scamService } from '../services/scamService';
import { newsService } from '../services/newsService';
import { AlertTriangle, Plus, Shield, MapPin, ExternalLink, Clock, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';

const ScamAlerts = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [alerts, setAlerts] = useState([]);
  const [news, setNews] = useState([]);
  const [activeTab, setActiveTab] = useState('news'); // 'news' or 'reports'
  const [loading, setLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'Medium',
    location: { state: '', district: '' },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [newsData, alertsData] = await Promise.all([
        newsService.getScamNews().catch(() => []),
        scamService.getAll({ verified: true }).catch(() => [])
      ]);
      setNews(newsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      await scamService.reportScam(formData);
      alert('Scam report submitted! It will be reviewed by our team.');
      setShowReportForm(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        severity: 'Medium',
        location: { state: '', district: '' },
      });
      loadData();
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Low: 'bg-blue-100 text-blue-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-orange-100 text-orange-800',
      Critical: 'bg-red-100 text-red-800',
    };
    return colors[severity] || colors.Medium;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Scam Alerts</h1>
          <p className="text-gray-600">Stay informed about recent frauds and scams in India</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setShowReportForm(!showReportForm)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Report Scam</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'news'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-blue-600'
          }`}
        >
          <Newspaper className="w-4 h-4 inline mr-2" />
          Latest News
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'reports'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-blue-600'
          }`}
        >
          <Shield className="w-4 h-4 inline mr-2" />
          User Reports
        </button>
      </div>

      {/* Report Form */}
      {showReportForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold mb-4">Report a Scam</h2>
          <form onSubmit={handleSubmitReport} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows="4"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Select Category</option>
              <option value="Fake Loan App">Fake Loan App</option>
              <option value="Phishing">Phishing</option>
              <option value="UPI Fraud">UPI Fraud</option>
              <option value="Investment Scam">Investment Scam</option>
              <option value="Identity Theft">Identity Theft</option>
              <option value="Other">Other</option>
            </select>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Submit Report
              </button>
              <button
                type="button"
                onClick={() => setShowReportForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* News Feed (Google News Style) */}
      {activeTab === 'news' && (
        <>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading latest scam news...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No news available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border border-gray-200 cursor-pointer group"
                  onClick={() => {
                    if (article.url && article.url !== '#') {
                      window.open(article.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  {/* Article Image */}
                  {article.imageUrl && (
                    <div className="w-full h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    {/* Source and Time */}
                    <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">{article.source}</span>
                        {article.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {article.location}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(article.publishedAt)}
                      </div>
                    </div>

                    {/* Category Badge */}
                    {article.category && (
                      <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded mb-2">
                        {article.category}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition">
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {article.description || article.content}
                    </p>

                    {/* Read More Link */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{article.author || article.source}</span>
                      <div className="text-blue-600 group-hover:text-blue-700 text-xs font-semibold flex items-center">
                        Read full article
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </>
      )}

      {/* User Reports */}
      {activeTab === 'reports' && (
        <>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No scam alerts available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <h3 className="text-xl font-bold">{alert.title}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{alert.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">{alert.category}</span>
                      {alert.location?.state && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.location.state}</span>
                        </div>
                      )}
                    </div>
                    <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScamAlerts;

