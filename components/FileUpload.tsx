import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onAnalyze: (files: FileList) => void;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalyze, error }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFiles) {
      onAnalyze(selectedFiles);
    }
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFiles(event.dataTransfer.files);
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mb-6">
         <h2 className="text-3xl font-bold text-slate-900">Upload Your Health Reports</h2>
         <p className="mt-2 text-md text-slate-600">Securely upload images of your lab results for an AI-powered analysis.</p>
      </div>
     
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label 
            htmlFor="file-upload" 
            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <div className="flex justify-center items-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600">
                  <span className="text-indigo-600 hover:text-indigo-500">Upload an image file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/png, image/jpeg" />
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PNG or JPG up to 10MB</p>
              </div>
            </div>
          </label>
        </div>

        {selectedFiles && selectedFiles.length > 0 && (
          <div className="mb-6 text-left bg-slate-50 p-4 rounded-md">
            <h4 className="font-semibold text-slate-700">Selected Files:</h4>
            <ul className="list-disc list-inside mt-2 text-sm text-slate-600">
              {Array.from(selectedFiles).map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <div>
          <button
            type="submit"
            disabled={!selectedFiles || selectedFiles.length === 0}
            className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Analyze Reports
          </button>
        </div>

        <div className="mt-6 text-xs text-slate-500">
            <p>🔒 Your data is encrypted and processed securely. We respect your privacy.</p>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;