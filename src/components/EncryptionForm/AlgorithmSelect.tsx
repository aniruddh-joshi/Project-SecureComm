import React from 'react';
import { FileText, Key } from 'lucide-react';
import { Algorithm } from '../../utils/types';
import { algorithms } from '../../utils/advanced-crypto';

interface AlgorithmSelectProps {
  algorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  showFileEncryption: boolean;
  onToggleFileEncryption: (show: boolean) => void;
}

export function AlgorithmSelect({
  algorithm,
  onAlgorithmChange,
  showFileEncryption,
  onToggleFileEncryption
}: AlgorithmSelectProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => onToggleFileEncryption(false)}
          className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
            !showFileEncryption ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <FileText size={18} /> Text Encryption
        </button>
        <button
          onClick={() => onToggleFileEncryption(true)}
          className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
            showFileEncryption ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Key size={18} /> File Encryption
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Algorithm
        </label>
        <select
          value={algorithm}
          onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {Object.entries(algorithms).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}