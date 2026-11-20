import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  Trophy,
  Target,
  BarChart2,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  MapPin,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';

export default function Home() {
  const highlights = [
    { icon: Zap, label: 'AI-Powered Analysis', color: 'text-indigo-400' },
    { icon: Trophy, label: 'Resume Scoring', color: 'text-amber-400' },
    { icon: Target, label: 'Skill Gap Detection', color: 'text-emerald-400' },
    { icon: BarChart2, label: 'Personalized Roadmaps', color: 'text-sky-400' },
  ];

  const features = [
    {
      icon: FileCheck2,
      title: 'Smart Resume Analysis',
      desc: 'Deep structural parsing and extraction of education, experience, and projects directly from PDF resumes.',
      tag: 'PyMuPDF Engine',
    },
    {
      icon: Cpu,
      title: 'AI Skill Detection',
      desc: 'Identifies technical and soft skills using Microsoft Azure AI Language key phrases and alias normalization.',
      tag: 'Azure AI',
    },
    {
      icon: Trophy,
      title: 'Resume Score (out of 100)',
      desc: 'Transparent, rule-based quality evaluation across 6 key categories with strengths and actionable weaknesses.',
      tag: 'Rule-Based',
    },
    {
      icon: Target,
      title: 'Skill Gap Analysis',
      desc: 'Compares your existing skills against industry standard job requirements to pinpoint exactly what you lack.',
      tag: 'Role Matching',
    },
    {
      icon: Sparkles,
      title: 'Career Recommendations',
      desc: 'Curated advice on high-impact projects, interview preparation focus areas, and immediate priorities.',
      tag: 'Career Guidance',
    },
    {
      icon: BookOpen,
      title: 'Learning Roadmap',
      desc: 'Dynamic week-by-week learning trajectory strictly tailored to your detected skill gaps with resource links.',
      tag: 'Personalized',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Upload Resume',
      desc: 'Upload your existing resume in PDF format (up to 5 MB).',
    },
    {
      num: '02',
      title: 'Select Job Role',
      desc: 'Choose your desired career track (e.g., Full Stack, Python, Data Analyst, AI/ML, Java).',
    },
    {
      num: '03',
      title: 'AI Analyzes Resume',
      desc: 'Our engine extracts text, detects skills, matches requirements, and scores content.',
    },
    {
      num: '04',
      title: 'Get Career Insights',
      desc: 'Explore your interactive dashboard, personalized roadmap, and download a complete PDF report.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50">
      
      {/* HERO SECTION - Deep Navy & Indigo Gradient matching reference image */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b0f29] via-[#0f1738] to-[#131b46] text-white pt-16 pb-24 lg:pt-20 lg:pb-32">
        
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Smart Resume Analysis &amp; Career Advisor</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Build a Stronger Career With AI-Powered{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
                  Resume Analysis
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Upload your resume, discover your skills, identify career gaps, and get personalized recommendations powered by AI.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/analyzer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Analyze My Resume</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                </Link>

                <a
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-2xl font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-sm transition-all"
                >
                  Explore Features
                </a>
              </div>

            </div>

            {/* Right Hero Graphic - 3D Resume Card matching reference image */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Glowing Outer Rings */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-30 animate-pulse-slow" />

                {/* Floating 3D Resume Card */}
                <div className="relative bg-gradient-to-b from-slate-900/90 to-indigo-950/90 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                  
                  {/* Top card header with RESUME label */}
                  <div className="flex items-center justify-between pb-6 border-b border-indigo-900/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
                          RESUME
                        </span>
                        <p className="text-sm font-semibold text-white">Full Stack Candidate</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Verified
                    </span>
                  </div>

                  {/* Document Skeleton Lines */}
                  <div className="py-6 space-y-3">
                    <div className="h-2.5 bg-indigo-800/40 rounded-full w-3/4" />
                    <div className="h-2 bg-indigo-900/50 rounded-full w-full" />
                    <div className="h-2 bg-indigo-900/50 rounded-full w-5/6" />
                    <div className="h-2 bg-indigo-900/50 rounded-full w-2/3" />
                  </div>

                  {/* Prominent Glowing AI Chip Illustration */}
                  <div className="relative flex items-center justify-center my-4">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex flex-col items-center justify-center text-white shadow-lg shadow-indigo-500/40 border border-indigo-300/40">
                      <Cpu className="w-9 h-9 stroke-[1.8]" />
                      <span className="text-xs font-black tracking-widest mt-0.5">AI</span>
                    </div>
                    {/* Concentric glowing rings */}
                    <div className="absolute -inset-3 rounded-3xl border border-indigo-400/30 animate-ping opacity-30" />
                    <div className="absolute -inset-5 rounded-3xl border border-purple-400/20" />
                  </div>

                  {/* Skills Mini Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-indigo-900/50">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      ✓ React.js
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      ✓ Python
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      + Express.js Gap
                    </span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

      {/* HIGHLIGHTS BAR - Direct replica of reference image */}
      <section className="relative -mt-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {item.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Automated &amp; Explainable
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            How ResumeAI Works
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            From raw resume PDF to an actionable career roadmap in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl font-extrabold text-indigo-100 tracking-tight">
                  {step.num}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
              <div className="w-8 h-1 bg-indigo-600/30 rounded-full mt-6" />
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-xs">
              Powerful Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Comprehensive Career Guidance Features
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Everything college students and freshers need to optimize their technical profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Icon className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 gap-1">
                    <span>Explore details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Analyze Your Resume?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Upload your PDF now and receive an instant breakdown of your strengths, skill gaps, resume score, and customized learning roadmap.
            </p>
            <div className="pt-4">
              <Link
                to="/analyzer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Launch Resume Analyzer</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
