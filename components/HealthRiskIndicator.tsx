
import React from 'react';
import { RiskLevel } from '../types';

interface HealthRiskIndicatorProps {
  level: RiskLevel;
}

const riskStyles: { [key in RiskLevel]: { color: string; bgColor: string; label: string } } = {
  [RiskLevel.Low]: {
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    label: 'Low Risk',
  },
  [RiskLevel.Medium]: {
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100',
    label: 'Medium Risk',
  },
  [RiskLevel.High]: {
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    label: 'High Risk',
  },
};

const HealthRiskIndicator: React.FC<HealthRiskIndicatorProps> = ({ level }) => {
  const styles = riskStyles[level];

  return (
    <div className={`text-center p-4 rounded-lg flex-shrink-0 ${styles.bgColor}`}>
      <p className="text-sm font-semibold text-slate-600">Overall Risk</p>
      <p className={`text-2xl font-bold mt-1 ${styles.color}`}>{styles.label}</p>
    </div>
  );
};

export default HealthRiskIndicator;
