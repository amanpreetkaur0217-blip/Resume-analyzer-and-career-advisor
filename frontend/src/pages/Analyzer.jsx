import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Sparkles, ArrowRight, AlertCircle, CheckCircle2, Info, ChevronDown } from 'lucide-react';
import ResumeUpload from '../components/ResumeUpload';
import LoadingAnimation from '../components/LoadingAnimation';
import { api } from '../services/api';

export default function Analyzer({ onAnalysisComplete }) {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [jobRoles, setJobRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeEngine, setActiveEngine] = useState('Loading...');

  // 5 Initial Roles fallback
  const defaultRoles = [
    { title: 'Full Stack Developer', description: 'Web client & server architecture' },
    { title: 'Python Developer', description: 'Backend APIs, data scripting & automation' },
    { title: 'Data Analyst', description: 'Business intelligence, SQL & statistical dashboards' },
    { title: 'AI/ML Engineer', description: 'Machine learning models, neural nets & pipelines' },
    { title: 'Java Developer', description: 'Enterprise microservices & Spring Boot backends' },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const rolesData = await api.getJobRoles();
        if (rolesData?.roles?.length > 0) {
          setJobRoles(rolesData.roles);
        } else {
          setJobRoles(defaultRoles);
        }

        const health = await api.checkHealth();
        if (health?.azure_status) {
          setActiveEngine(health.azure_status.active_mode);
        }
      } catch (err) {
        setJobRoles(defaultRoles);
        setActiveEngine('Local Fallback Engine');
      }
    }
    loadData();
  }, []);

  const handleUseSampleResume = async () => {
    setErrorMessage('');
    try {
      // Fetch actual real sample PDF from public directory
      const response = await fetch('/sample_resume.pdf');
      if (response.ok) {
        const blob = await response.blob();
        const sampleFile = new File([blob], 'John_Doe_Resume.pdf', {
          type: 'application/pdf',
          lastModified: Date.now(),
        });
        setSelectedFile(sampleFile);
      } else {
        // Fallback
        const fallbackText = "John Doe\nSoftware Developer\nB.Tech CSE\nPython, JavaScript, React, Node.js, SQL, Git";
        const sampleBlob = new Blob([fallbackText], { type: 'application/pdf' });
        const sampleFile = new File([sampleBlob], 'John_Doe_Resume.pdf', { type: 'application/pdf' });
        setSelectedFile(sampleFile);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMessage('Please upload or select a PDF resume.');
      return;
    }
    if (!selectedRole) {
      setErrorMessage('Please select a target job role.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await api.analyzeResume(selectedFile, selectedRole);
      
      if (result.success) {
        // Store in session storage for persistence on refresh
        sessionStorage.setItem('last_analysis', JSON.stringify(result));
        if (onAnalysisComplete) {
          onAnalysisComplete(result);
        }
        navigate('/dashboard');
      } else {
        setErrorMessage(result.error || 'Failed to analyze resume.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      const apiErr = err.response?.data?.error;
      setErrorMessage(apiErr || 'Failed to connect to backend server. Make sure Flask is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentRoleInfo = (jobRoles.length > 0 ? jobRoles : defaultRoles).find(
    (r) => r.title === selectedRole
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Title & Tagline matching reference image */}
        <div className="text-center sm:text-left space-y-1.5">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Resume Analyzer
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-normal">
            Upload your resume and select your job role to get started
          </p>
        </div>

        {/* Loading Overlay */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-xl">
            <LoadingAnimation statusText="Processing Resume with AI Engine" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Drag & Drop Card (7 cols) */}
            <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Step 1: Upload Document
                </span>
                <span className="text-[11px] text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full font-medium">
                  PDF Format
                </span>
              </div>

              <ResumeUpload
                selectedFile={selectedFile}
                onFileSelect={(file) => setSelectedFile(file)}
                onFileRemove={() => setSelectedFile(null)}
                onUseSample={handleUseSampleResume}
              />
            </div>

            {/* Right Column: Role Selection & Action Button (5 cols) */}
            <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                  Step 2: Select Job Role
                </span>

                {/* Job Role Dropdown Container */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {(jobRoles.length > 0 ? jobRoles : defaultRoles).map((role) => (
                      <option key={role.title} value={role.title}>
                        {role.title}
                      </option>
                    ))}
                  </select>

                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Role Description Preview */}
                {currentRoleInfo && (
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 leading-relaxed">
                    <p className="font-semibold text-slate-700 mb-0.5">Role Expectations:</p>
                    <p>{currentRoleInfo.description}</p>
                    {currentRoleInfo.required_skills && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {currentRoleInfo.required_skills.slice(0, 5).map((s) => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-600 font-medium">
                            {s}
                          </span>
                        ))}
                        {currentRoleInfo.required_skills.length > 5 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{currentRoleInfo.required_skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Analyze Resume Button matching reference image */}
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!selectedFile || !selectedRole}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                  !selectedFile || !selectedRole
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze Resume</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Active Engine:</span>
                <span className="font-semibold text-slate-600">{activeEngine}</span>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
