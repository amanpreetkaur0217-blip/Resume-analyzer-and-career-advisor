import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, ArrowRight, Activity, Sparkles, User } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const [azureStatus, setAzureStatus] = useState(null);
  const isDarkNav = location.pathname === '/';

  useEffect(() => {
    async function fetchStatus() {
      const data = await api.checkHealth();
      if (data && data.azure_status) {
        setAzureStatus(data.azure_status);
      }
    }
    fetchStatus();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analyzer', path: '/analyzer' },
    { name: 'About', path: '/about' },
  ];

  // Check if we have analysis in session storage
  const hasAnalysis = Boolean(sessionStorage.getItem('last_analysis'));

  return (
    <nav className={`w-full transition-colors duration-200 z-50 ${
      isDarkNav 
        ? 'bg-[#0b0f29]/95 text-white border-b border-indigo-900/40 backdrop-blur-md sticky top-0' 
        : 'bg-white/95 text-slate-800 border-b border-slate-200/80 backdrop-blur-md sticky top-0 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight ${isDarkNav ? 'text-white' : 'text-slate-900'}`}>
                Resume<span className="text-indigo-500">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:inline">
                Career Advisor
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? isDarkNav
                        ? 'text-white bg-indigo-600/30 border border-indigo-500/30'
                        : 'text-indigo-600 bg-indigo-50 font-semibold'
                      : isDarkNav
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {hasAnalysis && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    location.pathname === '/dashboard'
                      ? 'text-indigo-500 bg-indigo-500/10 font-semibold'
                      : isDarkNav ? 'text-indigo-300 hover:text-white' : 'text-indigo-600 hover:text-indigo-800'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/roadmap"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    location.pathname === '/roadmap'
                      ? 'text-indigo-500 bg-indigo-500/10 font-semibold'
                      : isDarkNav ? 'text-indigo-300 hover:text-white' : 'text-indigo-600 hover:text-indigo-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Roadmap
                </Link>
              </>
            )}
          </div>

          {/* Right Action & Engine Indicator */}
          <div className="flex items-center gap-3">
            {/* Status Pill */}
            {azureStatus && (
              <div
                title={azureStatus.active_mode}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  azureStatus.azure_language?.configured
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  azureStatus.azure_language?.configured ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'
                }`} />
                <span>{azureStatus.active_mode}</span>
              </div>
            )}

            {/* Get Started Button */}
            <Link
              to="/analyzer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* User Avatar Placeholder */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 p-[1.5px] hidden sm:block">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-semibold">
                <User className="w-4 h-4 text-indigo-200" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
}
