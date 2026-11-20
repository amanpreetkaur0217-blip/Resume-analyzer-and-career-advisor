import React from 'react';
import { Award, CheckCircle2, Code2, Cpu, FileText, Sparkles, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#070a1e] text-slate-400 border-t border-slate-800/80">
      
      {/* Featured Banner / Bottom Bar matching Reference Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
          
          {/* Technologies Used */}
          <div className="lg:col-span-5 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Technologies Used:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-800/50 text-sky-300 text-xs font-medium">
                <Code2 className="w-3.5 h-3.5 text-sky-400" />
                React
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/50 border border-amber-800/50 text-amber-300 text-xs font-medium">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                Python
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
                Flask
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-medium">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Azure AI
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/50 border border-rose-800/50 text-rose-300 text-xs font-medium">
                Chart.js
              </span>
            </div>
          </div>

          {/* Key Features */}
          <div className="lg:col-span-4 flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-slate-300 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-5">
            <span className="text-xs font-bold text-white uppercase tracking-wider w-full sm:w-auto">
              Key Features:
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Real Resume Analysis
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Azure AI Integration
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Skill Gap Analysis
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Career Recommendations
            </span>
          </div>

          {/* Slogan Banner */}
          <div className="lg:col-span-3 flex items-center justify-end">
            <div className="w-full sm:w-auto flex items-center gap-3 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-700/50 rounded-xl px-4 py-2.5 shadow-inner">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Your Career. Our AI.</p>
                <p className="text-[11px] text-indigo-200">Analyze • Improve • Grow</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-900 text-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">ResumeAI</span>
            <span>— Smart Resume Analysis and Personalized Career Guidance</span>
          </div>
          <div className="text-slate-500 text-center md:text-right">
            Designed for students, freshers, and job seekers. Educational &amp; Career Development Project.
          </div>
        </div>
      </div>

    </footer>
  );
}
