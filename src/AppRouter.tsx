import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Settings from './pages/Settings';
import PartnerDashboard from './pages/PartnerDashboard';
import ServicesPage from './pages/ServicesPage';
import AddServicePage from './pages/AddServicePage';
export function AppRouter() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<PartnerDashboard />} />
        <Route path="/dashboard" element={<PartnerDashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/new" element={<AddServicePage />} />
      </Routes>
    </BrowserRouter>;
}