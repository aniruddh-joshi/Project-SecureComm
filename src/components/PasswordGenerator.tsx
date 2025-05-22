import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, CheckCircle, Shield } from 'lucide-react';
import zxcvbn from 'zxcvbn';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [strengthFeedback, setStrengthFeedback] = useState<{
    score: number;
    feedback: { warning: string | null; suggestions: string[] };
  }>({ score: 0, feedback: { warning: null, suggestions: [] } });
  const [options, setOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (options.uppercase) chars += uppercase;
    if (options.lowercase) chars += lowercase;
    if (options.numbers) chars += numbers;
    if (options.symbols) chars += symbols;

    if (!chars) return;

    let generatedPassword = '';
    const array = new Uint32Array(options.length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < options.length; i++) {
      generatedPassword += chars[array[i] % chars.length];
    }

    setPassword(generatedPassword);
  };

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setStrengthFeedback({
        score: result.score,
        feedback: result.feedback
      });
    }
  }, [password]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = () => {
    switch (strengthFeedback.score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-lime-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthText = () => {
    switch (strengthFeedback.score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'No Password';
    }
  };

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Password / Key Generator</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Generated password will appear here"
          />
          <button
            onClick={copyToClipboard}
            className="p-3 text-gray-600 hover:text-gray-800 transition-colors bg-white rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50"
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle className="text-green-500" size={20} /> : <Copy size={20} />}
          </button>
          <button
            onClick={generatePassword}
            className="p-3 text-blue-600 hover:text-blue-700 transition-colors bg-white rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50"
            title="Generate new password"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">Length: {options.length}</span>
              <input
                type="range"
                min="8"
                max="20"
                value={options.length}
                onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={options.uppercase}
                onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={options.numbers}
                onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={options.symbols}
                onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Symbols (!@#$%)</span>
            </label>
          </div>
        </div>

        {password && (
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                style={{ width: `${(strengthFeedback.score + 1) * 20}%` }}
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Strength: <span className={`font-semibold ${getStrengthColor().replace('bg-', 'text-')}`}>
                    {getStrengthText()}
                  </span>
                </span>
              </div>
              {strengthFeedback.feedback.warning && (
                <p className="text-sm text-red-600">{strengthFeedback.feedback.warning}</p>
              )}
              {strengthFeedback.feedback.suggestions.length > 0 && (
                <ul className="text-sm text-gray-600 space-y-1 mt-2">
                  {strengthFeedback.feedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}