import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DailySummaryPage } from './pages/DailySummaryPage';
import { CustomersPage } from './pages/CustomersPage';

import { DeliveryNoteDetailsPage } from './pages/DeliveryNoteDetailsPage';
import { CreateDeliveryNotePage } from './pages/CreateDeliveryNotePage';
import { EditDeliveryNotePage } from './pages/EditDeliveryNotePage';
import { DeliveryNotesPage } from './pages/DeliveryNotesPage';
import { useAuthStore } from './features/auth/stores/authStore';
import type React from 'react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
}

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DailySummaryPage />
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
          path="/delivery-notes"
          element={
            <ProtectedRoute>
              <DeliveryNotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery-notes/new"
          element={
            <ProtectedRoute>
              <CreateDeliveryNotePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery-notes/:id"
          element={
            <ProtectedRoute>
              <DeliveryNoteDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery-notes/:id/edit"
          element={
            <ProtectedRoute>
              <EditDeliveryNotePage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<div style={{ padding: '20px' }}>
          <h1>Página no encontrada</h1>
          <a href="/login">Volver al Login</a>
        </div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
