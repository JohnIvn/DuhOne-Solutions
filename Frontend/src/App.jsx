import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import SubscriptionPage from './Pages/Subscription.jsx';
import LandingPage from './LandingPage.jsx';
import SignUp from './Pages/SignUp.jsx';
import SignIn from './Pages/SignIn.jsx';
import HomePage from './Pages/HomePage.jsx';
import AdminDashboard from './Pages/adminDashboard.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import Review from './Pages/Review.jsx';
import ForgotPassword from './components/ForgotPassworda.jsx';
import TransactionForm from './Pages/TransactionForm.jsx';
import Suspended from './Pages/suspended.jsx';

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
  const token = localStorage.getItem('token');

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on("disconnect", (reason) => {
      console.log(reason);
    });

    socket.on('message', (data) => {
      console.log('Message from server:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/homepage" /> : <LandingPage />}
        />
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
          path="/subscription/transaction"
          element={
            <ProtectedRoute>
              <TransactionForm />
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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-Portal"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suspended"
          element={
            <ProtectedRoute requiredRole="Admin">
              <Suspended />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={token ? <Navigate to="/homepage" /> : <Navigate to="/signin" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
