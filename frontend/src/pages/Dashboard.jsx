import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download,
  User,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  Map,
  FileDown,
  Info,
  Check,
  Cpu,
} from 'lucide-react';
import ScoreCard from '../components/ScoreCard';
import SkillBadge from '../components/SkillBadge';
import SkillChart from '../components/SkillChart';
import { api } from '../services/api';

export default function Dashboard({ analysisData }) {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  // Fallback to session storage if state not passed directly
  const data = analysisData || JSON.parse(sessionStorage.getItem('last_analysis') || 'null');

  if (!data || !data.success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-slate-100">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No Analysis Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            Please upload a resume first to view the interactive analysis dashboard.
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

  const { overview, scoring, matching, detected_skills, roadmap, engine_info } = data;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await api.downloadReport(data, overview.candidate_name);
    } catch (err) {
      console.error('Failed to download report:', err);
      alert('Could not generate PDF report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Grid with Left Sidebar & Right Content matching reference image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Mini Sidebar (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-2 sticky top-24">
            <div className="px-3 py-2 mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Navigation
              </span>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 transition-all text-left"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => navigate('/roadmap')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-left"
            >
              <Map className="w-4 h-4 text-slate-400" />
              <span>Career Roadmap</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-left"
            >
              <FileDown className="w-4 h-4 text-slate-400" />
              <span>{isDownloading ? 'Generating PDF...' : 'Download Report'}</span>
            </button>

            <button
              onClick={() => navigate('/about')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-left"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>About Engine</span>
            </button>

            {/* Quick Engine Info Pill */}
            <div className="pt-6 mt-6 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                <span className="font-semibold text-slate-700 block">Processing Mode</span>
                <span className={`inline-flex items-center gap-1 font-medium ${
                  engine_info?.is_azure_language ? 'text-emerald-600' : 'text-indigo-600'
                }`}>
                  <Cpu className="w-3.5 h-3.5" />
                  {engine_info?.active_mode || 'Local Fallback Engine'}
                </span>
              </div>
            </div>

          </div>

          {/* Right Main Content (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Header with Title and Download Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Analysis Results
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Here's your comprehensive resume analysis and compatibility summary
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Generating...' : 'Download Report'}</span>
              </button>
            </div>

            {/* TOP SUMMARY ROW: Candidate Info + Resume Score + Skill Match Score */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              
              {/* Candidate Profile Card (6 cols) */}
              <div className="md:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                  <User className="w-8 h-8 stroke-[1.8]" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-lg font-extrabold text-slate-900 truncate">
                    {overview.candidate_name || 'Candidate'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{overview.education || "Bachelor's Degree"}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {overview.experience || 'Fresher / Entry-Level'}
                  </p>
                  <div className="pt-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-[11px] font-bold">
                      Role: {overview.target_role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resume Score Circular Card (3 cols) */}
              <div className="md:col-span-3">
                <ScoreCard
                  score={scoring.overall_score}
                  maxScore={100}
                  label="Resume Score"
                  sublabel="Content Quality"
                  type="number"
                  color={scoring.overall_score >= 75 ? 'emerald' : scoring.overall_score >= 50 ? 'indigo' : 'rose'}
                />
              </div>

              {/* Skill Match Score Circular Card (3 cols) */}
              <div className="md:col-span-3">
                <ScoreCard
                  score={matching.skill_match_percentage}
                  maxScore={100}
                  label="Skill Match"
                  sublabel={`${matching.matched_required_count}/${matching.total_required_count} Required`}
                  type="percent"
                  color={matching.skill_match_percentage >= 70 ? 'emerald' : matching.skill_match_percentage >= 40 ? 'indigo' : 'rose'}
                />
              </div>

            </div>

            {/* MIDDLE ROW: Skills Found & Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Skills Found */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Skills Found ({matching.matched_required_skills.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Matched
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {matching.matched_required_skills.length > 0 ? (
                      matching.matched_required_skills.map((skill) => (
                        <SkillBadge key={skill} name={skill} variant="matched" />
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 py-2">
                        No core required skills detected for this role yet.
                      </p>
                    )}
                  </div>
                </div>

                {matching.matched_preferred_skills?.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Preferred / Bonus Skills Found:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matching.matched_preferred_skills.map((skill) => (
                        <SkillBadge key={skill} name={skill} variant="preferred" size="sm" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Missing Skills */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Missing Skills ({matching.missing_required_skills.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
                      Action Required
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {matching.missing_required_skills.length > 0 ? (
                      matching.missing_required_skills.map((skill) => (
                        <SkillBadge key={skill} name={skill} variant="missing" />
                      ))
                    ) : (
                      <p className="text-xs text-emerald-600 font-medium py-2">
                        🎉 Great job! You matched all required core skills for this role.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Need to bridge these gaps?</span>
                  <Link
                    to="/roadmap"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>View Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>

            {/* STRENGTHS & IMPROVEMENTS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Resume Strengths */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Resume Strengths</h3>
                </div>

                <ul className="space-y-2.5">
                  {scoring.strengths.slice(0, 4).map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvement Suggestions */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">Improvement Suggestions</h3>
                </div>

                <ul className="space-y-2.5">
                  {scoring.improvement_suggestions.slice(0, 4).map((sug, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                        !
                      </div>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* CHARTS ROW (Donut chart & score breakdown) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-6">
                <SkillChart
                  matchedCount={matching.matched_required_count}
                  missingCount={matching.missing_required_count}
                  categoryScores={scoring.category_scores}
                />
              </div>

              {/* Category Breakdown Card */}
              <div className="md:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100">
                    Evaluation Category Scores
                  </h3>

                  <div className="space-y-3 mt-4">
                    {Object.entries(scoring.category_scores || {}).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">{val.label}</span>
                          <span className="font-bold text-slate-900">{val.score}/{val.max} pts ({val.percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              val.percentage >= 80 ? 'bg-emerald-500' : val.percentage >= 60 ? 'bg-indigo-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${val.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mt-4 pt-3 border-t border-slate-100 italic">
                  {scoring.disclaimer}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
