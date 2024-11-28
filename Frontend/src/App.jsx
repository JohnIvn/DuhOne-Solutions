import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SubscriptionPage from './Pages/Subscription.jsx';
import LandingPage from './LandingPage.jsx';
import SignUp from './Pages/SignUp.jsx';
import SignIn from './Pages/SignIn.jsx';
import HomePage from './Pages/HomePage.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import Review from './Pages/Review.jsx';
import UserProfile from './Pages/UserProfile.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');  
    
    if (!token) {
      return <Navigate to="/signin" />;
    }
    
    if (requiredRole && role !== requiredRole) {
      return <Navigate to="/homepage" />;
    }
    
    return children;
  };

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route
                    path="/homepage"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/subscription"
                    element={
                        <ProtectedRoute>
                            <SubscriptionPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/userprofile"
                    element={
                        <ProtectedRoute>
                            <UserProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/review"
                    element={
                        <ProtectedRoute>
                            <Review />
                        </ProtectedRoute>
                    }
                />
                <Route path="/clients" 
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
