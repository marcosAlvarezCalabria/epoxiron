import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { RatesPage } from './pages/RatesPage';
import { DeliveryNotesPage } from './pages/DeliveryNotesPage';
import { useAuthStore } from './features/auth/stores/authStore';
import type React from 'react';

function ProtectedRoute ({ children }: { children: React.ReactNode }) {
  const { isAuthenticated }= useAuthStore();
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rates"
          element={
            <ProtectedRoute>
              <RatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery-notes"
          element={
            <ProtectedRoute>
              <DeliveryNotesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<div style={{padding: '20px'}}>
          <h1>Página no encontrada</h1>
          <a href="/dashboard">Volver al Dashboard</a>
        </div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
