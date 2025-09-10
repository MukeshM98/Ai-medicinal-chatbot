import React, { useState } from 'react';
import type { AnalysisResult } from './types';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import Spinner from './components/Spinner';
import { analyzeHealthReport, fileToGenerativePart } from './services/geminiService';


const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (files: FileList) => {
    if (files.length === 0) {
      setError("Please upload at least one health report image.");
      return;
    }

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
        setError("Please upload valid image files (PNG, JPG, etc.). This demo does not support PDFs.");
        return;
    }

    setError(null);
    setIsLoading(true);
    setAnalysisResult(null);

    try {
        const imageParts = await Promise.all(
            imageFiles.map(file => fileToGenerativePart(file))
        );

        const result = await analyzeHealthReport(imageParts);
        setAnalysisResult(result);

    } catch (err) {
        console.error("Analysis failed:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis.";
        setError(`Failed to analyze the report. This could be due to an issue with the API or the uploaded file. Please try again. Details: ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 2a1 1 0 00-.707.293L3.414 5.172A1 1 0 003 5.886V17a1 1 0 001 1h12a1 1 0 001-1V5.886a1 1 0 00-.414-.714l-2.879-2.879A1 1 0 0013 2H7zm4 6a2 2 0 100-4 2 2 0 000 4zM7 12a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h2a1 1 0 100-2H8z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Health Report Analyzer</h1>
          </div>
          {analysisResult && (
             <button onClick={handleReset} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Analyze New Report
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Spinner />
            <p className="text-lg font-medium text-slate-600 mt-4">AI is analyzing your reports...</p>
            <p className="text-sm text-slate-500">Extracting data and generating insights. This may take a moment.</p>
          </div>
        ) : analysisResult ? (
          <Dashboard result={analysisResult} />
        ) : (
          <FileUpload onAnalyze={handleAnalyze} error={error} />
        )}
      </main>
    </div>
  );
};

export default App;