import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PowerSyncContext } from '@powersync/react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { powersync, setupPowerSync } from './lib/powersync';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// The old static App is now the PublicCard view (we'll refactor this later)
import PublicCard from './pages/PublicCard';
import Dashboard from './pages/Dashboard';

import './App.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!session) return <Navigate to="/auth/login" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Public Digital Card view */}
      <Route path="/:digital_card_url" element={<PublicCard />} />
    </Routes>
  );
};

const App = () => {
  useEffect(() => {
    // Initialize PowerSync offline database connection
    setupPowerSync();
  }, []);

  return (
    <AuthProvider>
      <PowerSyncContext.Provider value={powersync}>
        <div className="App">
          <AppRoutes />
        </div>
      </PowerSyncContext.Provider>
    </AuthProvider>
  );
};

export default App;
