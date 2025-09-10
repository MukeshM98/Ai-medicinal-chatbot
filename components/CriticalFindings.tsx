import React from 'react';
import { WarningIcon } from './icons/WarningIcon';

interface CriticalFindingsProps {
  findings: string[];
}

const CriticalFindings: React.FC<CriticalFindingsProps> = ({ findings }) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <WarningIcon className="h-6 w-6 text-yellow-500" aria-hidden="true" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-yellow-800">
            Important Findings to Review
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              The AI analysis highlighted the following items that may require your attention. Please discuss these with your healthcare provider.
            </p>
            <ul role="list" className="list-disc space-y-1 pl-5 mt-3">
              {findings.map((finding, index) => (
                <li key={index} className="font-medium">{finding}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalFindings;