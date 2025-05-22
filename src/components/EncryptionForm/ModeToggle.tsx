import React from 'react';
import { Lock, Unlock } from 'lucide-react';

interface ModeToggleProps {
  mode: 'encrypt' | 'decrypt';
  onModeChange: (mode: 'encrypt' | 'decrypt') => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex space-x-3">
      <button
        onClick={() => onModeChange('encrypt')}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
          mode === 'encrypt'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Lock size={18} /> Encrypt
      </button>
      <button
        onClick={() => onModeChange('decrypt')}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
          mode === 'decrypt'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Unlock size={18} /> Decrypt
      </button>
    </div>
  );
}