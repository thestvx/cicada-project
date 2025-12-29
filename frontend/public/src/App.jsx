// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import './i18n';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Deposits from './pages/Deposits';
import Withdrawals from './pages/Withdrawals';
import Investments from './pages/Investments';
import Profile from './pages/Profile';

// Components
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document direction based on language
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <>
              <Navbar />
              <Dashboard />
            </>
          </PrivateRoute>
        } />
        
        <Route path="/tasks" element={
          <PrivateRoute>
            <>
              <Navbar />
              <Tasks />
            </>
          </PrivateRoute>
        } />
        
        <Route path="/deposits" element={
          <PrivateRoute>
            <>
              <Navbar />
              <Deposits />
            </>
          </PrivateRoute>
        } />
        
        <Route path="/withdrawals" element={
          <PrivateRoute>
            <>
              <Navbar />
              <Withdrawals />
            </>
          </PrivateRoute>
        } />
        
        <Route path="/investments" element={
          <PrivateRoute>
            <>
              <Navbar />
              <Investments />
            </>
          </PrivateRoute>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <>
              <Navbar />
              <Profile />
            </>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
