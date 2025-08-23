import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AccountPage } from './pages/AccountPage';
import { PositionsPage } from './pages/PositionsPage';
import { AnalysisPage } from './pages/AnalysisPage';

export function App() {
  // Toggle this to enable/disable mock data mode
  const USE_MOCK_DATA = false; // Set to true to use mock data
  
  return <Router>
      <Layout>
        <Routes>
          <Route path="/account" element={<AccountPage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/analysis" element={<AnalysisPage mockDataMode={USE_MOCK_DATA} />} />
          <Route path="/" element={<Navigate to="/analysis" replace />} />
        </Routes>
      </Layout>
    </Router>;
}