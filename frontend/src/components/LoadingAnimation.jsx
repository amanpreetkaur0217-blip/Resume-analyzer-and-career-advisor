import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, FileSearch, ShieldCheck } from 'lucide-react';

export default function LoadingAnimation({ statusText = 'Analyzing Resume...' }) {
  const steps = [
    { title: 'Parsing PDF Document', desc: 'Extracting text, sections, and metadata via PyMuPDF' },
    { title: 'AI Key Phrase Extraction', desc: 'Running natural language processing and entity detection' },
    { title: 'Skill Identification', desc: 'Matching detected technologies against target role requirements' },
    { title: 'Quality Scoring & Evaluation', desc: 'Calculating rule-based quality score and project metrics' },
    { title: 'Personalized Career Guidance', desc: 'Synthesizing recommendations and tailored learning roadmap' },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-md mx-auto">
      {/* Animated Glowing Chip */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 animate-pulse">
          <Cpu className="w-12 h-12 stroke-[1.8] animate-spin-slow" />
        </div>
        
        {/* Pulsing Outer Rings */}
        <div className="absolute -inset-2 rounded-3xl border-2 border-indigo-400/40 animate-ping opacity-75" />
        <div className="absolute -inset-4 rounded-3xl border border-purple-400/20" />
      </div>

      {/* Dynamic Status Text */}
      <h3 className="text-xl font-bold text-slate-800 tracking-tight">
        {statusText}
      </h3>
      <p className="text-sm font-medium text-indigo-600 mt-1 min-h-[20px]">
        {steps[currentStep].title}
      </p>
      <p className="text-xs text-slate-400 mt-0.5">
        {steps[currentStep].desc}
      </p>

      {/* Step Dots */}
      <div className="flex items-center gap-2 mt-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentStep
                ? 'w-7 bg-indigo-600'
                : i < currentStep
                ? 'w-3 bg-emerald-500'
                : 'w-2 bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
