
import React from 'react';
import type { HealthMetric } from '../types';
import { RiskLevel } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { WarningIcon } from './icons/WarningIcon';
import { DangerIcon } from './icons/DangerIcon';

interface SummaryCardProps {
  metric: HealthMetric;
}

const statusStyles = {
  [RiskLevel.Low]: {
    icon: <CheckIcon className="h-6 w-6 text-green-500" />,
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-500',
  },
  [RiskLevel.Medium]: {
    icon: <WarningIcon className="h-6 w-6 text-yellow-500" />,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-500',
  },
  [RiskLevel.High]: {
    icon: <DangerIcon className="h-6 w-6 text-red-500" />,
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-500',
  },
};


const SummaryCard: React.FC<SummaryCardProps> = ({ metric }) => {
  const styles = statusStyles[metric.status];

  return (
    <div className={`p-4 rounded-lg shadow-sm border-l-4 ${styles.borderColor} ${styles.bgColor}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-700">{metric.name}</h4>
        {styles.icon}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-slate-900">
          {metric.value} <span className="text-lg font-normal text-slate-500">{metric.unit}</span>
        </p>
      </div>
      <div className="mt-2">
        <p className={`text-sm font-medium px-2 py-1 inline-block rounded ${styles.bgColor} ${styles.textColor}`}>
          Status: {metric.status}
        </p>
      </div>
       <div className="mt-3 border-t border-slate-200 pt-2">
         <p className="text-xs text-slate-500">Ref: {metric.referenceRange}</p>
       </div>
    </div>
  );
};

export default SummaryCard;
