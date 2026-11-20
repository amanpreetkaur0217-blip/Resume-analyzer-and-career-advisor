import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import About from './pages/About';

export default function App() {
  const [analysisData, setAnalysisData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('last_analysis');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    try {
      sessionStorage.setItem('last_analysis', JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to session storage', e);
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/analyzer"
              element={<Analyzer onAnalysisComplete={handleAnalysisComplete} />}
            />
            <Route
              path="/dashboard"
              element={<Dashboard analysisData={analysisData} />}
            />
            <Route
              path="/roadmap"
              element={<Roadmap analysisData={analysisData} />}
            />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
