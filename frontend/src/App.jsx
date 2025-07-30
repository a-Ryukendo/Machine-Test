import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/dashboard';
import AgentsPage from './pages/AgentsPage';
import UploadListPage from './pages/UploadListPage';
import { AuthProvider } from './contexts/AuthContext.jsx';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/upload-list" element={<UploadListPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;