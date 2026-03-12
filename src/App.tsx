/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { AdminDashboard } from './pages/AdminDashboard';
import { Feedback } from './pages/Feedback';
import { Login } from './pages/Login';
import { PostDetail } from './pages/PostDetail';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post/:id" element={<PostDetail />} /> 
          </Routes>
          <Navbar />
        </div>
      </Router>
    </AuthProvider>
  );
}





