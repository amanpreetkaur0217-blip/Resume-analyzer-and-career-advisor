import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Circle,
  BookOpen,
  FolderGit2,
  ArrowRight,
  Target,
  Trophy,
  Laptop,
} from 'lucide-react';

export default function Roadmap({ analysisData }) {
  // Retrieve analysis data from props or session storage
  const data = analysisData || JSON.parse(sessionStorage.getItem('last_analysis') || 'null');

  const [roadmapSteps, setRoadmapSteps] = useState([]);
  const [selectedResourceStep, setSelectedResourceStep] = useState(null);

  useEffect(() => {
    if (data && data.roadmap) {
      // Check if user has saved completion states in local storage
      const savedCompleted = JSON.parse(localStorage.getItem('roadmap_completed_steps') || '{}');
      const initialized = data.roadmap.map((step) => ({
        ...step,
        completed: Boolean(savedCompleted[step.id]),
      }));
      setRoadmapSteps(initialized);
    }
  }, [data]);

  const toggleStepCompleted = (stepId) => {
    setRoadmapSteps((prev) => {
      const updated = prev.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s));
      const savedMap = {};
      updated.forEach((s) => {
        if (s.completed) savedMap[s.id] = true;
      });
      localStorage.setItem('roadmap_completed_steps', JSON.stringify(savedMap));
      return updated;
    });
  };

  if (!data || !data.success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-slate-100">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No Roadmap Generated</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            Upload your resume in the analyzer to generate your tailored career roadmap.
          </p>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all"
          >
            Go to Analyzer <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const roleName = data.overview?.target_role || 'Selected Role';
  const completedCount = roadmapSteps.filter((s) => s.completed).length;
  const progressPct = roadmapSteps.length > 0 ? Math.round((completedCount / roadmapSteps.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header Card matching reference image */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Your Personalized Career Roadmap
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              A step-by-step learning plan to improve your skills and bridge identified gaps
            </p>

            {/* Selected Role Badge */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-bold">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Selected Role: {roleName}</span>
              </span>
            </div>
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4 min-w-[220px]">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md shadow-indigo-600/20">
              {progressPct}%
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {completedCount} of {roadmapSteps.length} Completed
              </p>
              <div className="w-28 bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Timeline Stepper Container matching reference image */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative">
          
          <div className="space-y-6 relative">
            
            {/* Continuous Vertical Timeline Line */}
            <div className="absolute left-[31px] sm:left-[39px] top-6 bottom-6 w-0.5 bg-indigo-100" />

            {roadmapSteps.map((step, idx) => {
              const isHigh = step.priority?.toLowerCase().includes('high');
              return (
                <div
                  key={step.id || idx}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                    step.completed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-xs'
                  }`}
                >
                  
                  {/* Left Column: Timeline Node & Week Range */}
                  <div className="flex items-center gap-4 z-10 shrink-0">
                    {/* Toggle Node Button */}
                    <button
                      type="button"
                      onClick={() => toggleStepCompleted(step.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        step.completed
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-white border-2 border-indigo-400 text-transparent hover:border-indigo-600'
                      }`}
                      title={step.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      <CheckCircle2 className="w-5 h-5 fill-current" />
                    </button>

                    <div className="min-w-[80px]">
                      <span className="text-xs font-bold text-slate-900 block">
                        {step.weeks || `Week ${idx * 2 + 1}-${idx * 2 + 2}`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Milestone {idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Title & Description */}
                  <div className="sm:flex-1 pl-12 sm:pl-2 space-y-1">
                    <h3 className={`text-sm sm:text-base font-bold ${
                      step.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                      {step.description}
                    </p>

                    {step.milestone_project && (
                      <p className="text-[11px] text-indigo-700 font-medium pt-1 flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>Project Milestone: {step.milestone_project}</span>
                      </p>
                    )}
                  </div>

                  {/* Right Column: Priority Badge & Learn Resources Button */}
                  <div className="flex items-center gap-3 pl-12 sm:pl-0 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isHigh
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {step.priority || 'Medium'}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedResourceStep(step)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
                    >
                      <span>Learn Resources</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* Learning Resources Modal */}
      {selectedResourceStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  {selectedResourceStep.weeks}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {selectedResourceStep.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedResourceStep(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedResourceStep.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recommended Learning Links &amp; Docs:
              </h4>
              <div className="space-y-2">
                {selectedResourceStep.resources?.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 text-xs text-slate-800 font-semibold transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      <span>{res.name}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {selectedResourceStep.milestone_project && (
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-1">
                <span className="font-bold text-indigo-900 block">Milestone Capstone:</span>
                <p className="text-indigo-800">{selectedResourceStep.milestone_project}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedResourceStep(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
