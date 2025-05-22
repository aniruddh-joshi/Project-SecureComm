import React from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const result = zxcvbn(password);
  const strengthScore = result.score; // 0-4

  const getStrengthColor = () => {
    switch (strengthScore) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-lime-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthText = () => {
    switch (strengthScore) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'No Password';
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getStrengthColor()} transition-all duration-300`}
          style={{ width: `${(strengthScore + 1) * 20}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Strength: {getStrengthText()}</span>
        {result.feedback.warning && (
          <span className="text-red-500">{result.feedback.warning}</span>
        )}
      </div>
    </div>
  );
}