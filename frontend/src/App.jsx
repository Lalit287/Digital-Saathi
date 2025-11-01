import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from './store/store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import LessonDetail from './pages/LessonDetail';
import Chat from './pages/Chat';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import ScamAlerts from './pages/ScamAlerts';
import Investments from './pages/Investments';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

// Component to initialize theme on app load
const ThemeInitializer = () => {
  useEffect(() => {
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    let theme = savedTheme || 'light';
    
    if (!savedTheme) {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
      }
    }
    
    // Apply theme to document immediately
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return null;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeInitializer />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="learn" element={<Learn />} />
            <Route path="learn/:id" element={<LessonDetail />} />
            <Route path="chat" element={<Chat />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="scams" element={<ScamAlerts />} />
            <Route path="investments" element={<Investments />} />
            <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
