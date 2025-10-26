import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Courses from './components/Courses';
import Educators from './components/Educators';
import Tuitions from './components/Tuitions';
import Competitions from './components/Competitions';
import About from './components/About';
import Contact from './components/Contact';
import Services from './components/Services';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import CourseDetails from './components/CourseDetails';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import FAQ from './components/FAQ';
import PrivacyNotification from './components/PrivacyNotification';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Navigation />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
            <Route path="/educators" element={<ProtectedRoute><Educators /></ProtectedRoute>} />
            <Route path="/tuitions" element={<ProtectedRoute><Tuitions /></ProtectedRoute>} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </div>

        <Footer />
        <AIAssistant />
        <PrivacyNotification />
      </div>
    </Router>
  );
}

export default App;