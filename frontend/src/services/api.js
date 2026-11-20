import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
});

export const api = {
  // Check backend and Azure AI health status
  async checkHealth() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'offline', error: error.message };
    }
  },

  // Fetch supported job roles and their skill requirements
  async getJobRoles() {
    try {
      const response = await apiClient.get('/job-roles');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch job roles:', error);
      throw error;
    }
  },

  // Upload resume and run complete analysis
  async analyzeResume(file, role, onProgress) {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('role', role);

    const response = await apiClient.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  // Re-generate or customize roadmap
  async generateRoadmap(role, missingSkills, matchedSkills) {
    const response = await apiClient.post('/generate-roadmap', {
      role,
      missing_skills: missingSkills,
      matched_skills: matchedSkills,
    });
    return response.data;
  },

  // Trigger download of PDF analysis report
  async downloadReport(analysisData, candidateName = 'Candidate') {
    const response = await apiClient.post('/download-report', analysisData, {
      responseType: 'blob',
    });

    // Create a blob URL and click to download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedName = (candidateName || 'Candidate').replace(/\s+/g, '_');
    link.setAttribute('download', `Resume_Analysis_${sanitizedName}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default api;
