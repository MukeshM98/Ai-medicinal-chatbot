
import React from 'react';
import { CheckIcon } from './icons/CheckIcon';

interface RecommendationsProps {
  recommendations: string[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  return (
    <ul className="space-y-4">
      {recommendations.map((rec, index) => (
        <li key={index} className="flex items-start">
          <div className="flex-shrink-0">
            <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
          </div>
          <p className="ml-3 text-slate-600">{rec}</p>
        </li>
      ))}
    </ul>
  );
};

export default Recommendations;
