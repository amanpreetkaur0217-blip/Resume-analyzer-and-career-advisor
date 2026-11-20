import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Code2,
  Database,
  FileText,
  Workflow,
  Sparkles,
  Server,
} from 'lucide-react';
import { api } from '../services/api';

export default function About() {
  const [azureStatus, setAzureStatus] = useState(null);

  useEffect(() => {
    async function getStatus() {
      const data = await api.checkHealth();
      if (data && data.azure_status) {
        setAzureStatus(data.azure_status);
      }
    }
    getStatus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1 rounded-full">
            Project Architecture &amp; Documentation
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About AI Resume Analyzer &amp; Career Advisor
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Smart resume analysis and personalized career guidance powered by Microsoft Azure AI and robust rule-based evaluation.
          </p>
        </div>

        {/* Live Azure Engine Status Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Active Analysis Engine Status
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time connectivity to Microsoft Azure AI cloud services
                </p>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              azureStatus?.azure_language?.configured
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              {azureStatus?.active_mode || 'Checking...'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-semibold text-slate-700 block">Azure AI Language:</span>
              <span className={azureStatus?.azure_language?.configured ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'}>
                {azureStatus?.azure_language?.configured ? 'Connected (Key Phrases)' : 'Fallback to Local NLP'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-semibold text-slate-700 block">Azure AI Foundry:</span>
              <span className={azureStatus?.azure_foundry?.configured ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'}>
                {azureStatus?.azure_foundry?.configured ? 'Connected (GenAI Advice)' : 'Rule-Based Advisor'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-semibold text-slate-700 block">PyMuPDF / OCR:</span>
              <span className="text-indigo-600 font-bold">
                Direct Vector Text Parser
              </span>
            </div>
          </div>
        </div>

        {/* Problem Statement & Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="text-xl">⚠️</span> Problem Statement
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              College students, freshers, and early-career job seekers often struggle to identify whether their resumes adequately align with target job roles. Generic automated tools provide opaque rejection scores without actionable explanations or a clear learning path to bridge technical gaps.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="text-xl">🎯</span> Project Objectives
            </h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Extract structured details from PDF resumes accurately.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Detect and normalize both technical and soft skills.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Calculate an explainable quality score out of 100.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Generate dynamic, personalized missing-skills roadmaps.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Azure AI vs Local Fallback Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Dual Engine Architecture: Azure AI vs. Local Fallback
          </h3>
          <p className="text-xs text-slate-500">
            Our platform guarantees 100% operational capability with zero downtime, even without cloud API keys:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 border-b border-slate-200">Capability</th>
                  <th className="p-3 border-b border-slate-200">With Microsoft Azure AI</th>
                  <th className="p-3 border-b border-slate-200">Local Fallback Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Key Phrase Extraction</td>
                  <td className="p-3 text-emerald-700 font-medium">Azure AI Language (Text Analytics API)</td>
                  <td className="p-3 text-slate-600">Regex &amp; N-Gram Tokenizer</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Skill Detection &amp; Aliases</td>
                  <td className="p-3 text-emerald-700 font-medium">Augmented with Azure Key Phrases</td>
                  <td className="p-3 text-slate-600">Comprehensive Canonical Skill Dictionary</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Resume Quality Scoring</td>
                  <td className="p-3 text-slate-800">Transparent 6-Category Rule Engine (100 pts)</td>
                  <td className="p-3 text-slate-800">Transparent 6-Category Rule Engine (100 pts)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Career Guidance</td>
                  <td className="p-3 text-emerald-700 font-medium">Azure AI Foundry (LLM Synthesis)</td>
                  <td className="p-3 text-slate-600">Curated Role Milestone &amp; Project Engine</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Scanned Document OCR</td>
                  <td className="p-3 text-emerald-700 font-medium">Azure Document Intelligence</td>
                  <td className="p-3 text-slate-600">Informs user to provide digital text PDF</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Core Technology Stack
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
              <span className="font-extrabold text-indigo-600 text-sm block">React 18 + Vite</span>
              <span className="text-slate-500">Modern SPA UI</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
              <span className="font-extrabold text-amber-600 text-sm block">Python + Flask</span>
              <span className="text-slate-500">RESTful Microservice</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
              <span className="font-extrabold text-sky-600 text-sm block">PyMuPDF</span>
              <span className="text-slate-500">Vector PDF Parsing</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
              <span className="font-extrabold text-purple-600 text-sm block">ReportLab</span>
              <span className="text-slate-500">Dynamic PDF Reports</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
