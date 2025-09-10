
import React from 'react';
import type { AnalysisResult } from '../types';
import SummaryCard from './SummaryCard';
import HealthRiskIndicator from './HealthRiskIndicator';
import Recommendations from './Recommendations';
import HealthTimelineChart from './HealthTimelineChart';
import Chatbot from './Chatbot';
import CriticalFindings from './CriticalFindings';
import { DownloadIcon } from './icons/DownloadIcon';

interface DashboardProps {
  result: AnalysisResult;
}

const Dashboard: React.FC<DashboardProps> = ({ result }) => {
  const handleDownloadReport = () => {
    alert("Downloading report functionality would be implemented here.");
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start p-6 bg-white rounded-lg shadow-md">
        <div>
            <h2 className="text-3xl font-bold text-slate-900">Your Health Analysis</h2>
            <p className="mt-1 text-slate-600">
              Analysis for <span className="font-semibold">{result.patientInfo.name}</span> ({result.patientInfo.age}, {result.patientInfo.gender})
            </p>
        </div>
        <button
            onClick={handleDownloadReport}
            className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <DownloadIcon className="h-5 w-5 mr-2" />
            Download PDF
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overall Risk & Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Overall Assessment</h3>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <HealthRiskIndicator level={result.overallRisk} />
              <p className="text-slate-600 leading-relaxed border-l-4 border-indigo-200 pl-4">
                {result.summary}
              </p>
            </div>
          </div>

          {/* Critical Findings */}
          {result.criticalFindings && result.criticalFindings.length > 0 && (
            <CriticalFindings findings={result.criticalFindings} />
          )}

          {/* Key Metrics */}
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Key Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.metrics.map((metric) => (
                <SummaryCard key={metric.name} metric={metric} />
              ))}
            </div>
          </div>

          {/* Health Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Health Timeline</h3>
            <p className="text-slate-500 mb-4 text-sm">Key metrics over the last 18 months.</p>
            <HealthTimelineChart data={result.timelineData} />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Personalized Recommendations</h3>
            <Recommendations recommendations={result.recommendations} />
          </div>
          
          {/* Chatbot */}
          <div className="bg-white rounded-lg shadow-md">
             <Chatbot analysisResult={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;