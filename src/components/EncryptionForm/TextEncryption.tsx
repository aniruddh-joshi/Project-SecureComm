import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import { Algorithm } from '../../utils/types';
import { encryptText } from '../../utils/advanced-crypto';
import PasswordStrengthMeter from '../PasswordStrengthMeter';

interface TextEncryptionProps {
  input: string;
  key: string;
  algorithm: Algorithm;
  mode: 'encrypt' | 'decrypt';
  onInputChange: (value: string) => void;
  onKeyChange: (value: string) => void;
  onProcessed: (input: string, output: string) => void;
}

export function TextEncryption({
  input,
  key,
  algorithm,
  mode,
  onInputChange,
  onKeyChange,
  onProcessed
}: TextEncryptionProps) {
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const needsKey = ['AES', 'DES', 'RC4', 'BLOWFISH'].includes(algorithm);
  const needsShift = algorithm === 'CAESAR';
  const needsVigenereKey = algorithm === 'VIGENERE';

  const handleProcess = () => {
    if (!input) return;
    if ((needsKey || needsVigenereKey) && !key) return;
    if (needsShift && !key) return;

    try {
      const processed = encryptText(input, key, algorithm, mode === 'decrypt');
      setResult(processed);
      onProcessed(input, processed);
    } catch (error) {
      console.error('Processing failed:', error);
      setResult('Error: Invalid input or key for selected algorithm');
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {(needsKey || needsVigenereKey || needsShift) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {needsShift ? 'Shift (number)' : 'Encryption Key'}
          </label>
          <input
            type={needsShift ? 'number' : 'text'}
            value={key}
            onChange={(e) => onKeyChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder={needsShift ? 'Enter shift value (e.g. 3)' : 'Enter encryption key'}
          />
          {needsKey && <PasswordStrengthMeter password={key} />}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder={`Enter text to ${mode}...`}
        />
      </div>

      <button
        onClick={handleProcess}
        disabled={!input || (needsKey && !key) || (needsShift && !key) || (needsVigenereKey && !key)}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} Text
      </button>

      {result && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Result
          </label>
          <div className="relative">
            <textarea
              readOnly
              value={result}
              className="w-full p-3 border border-gray-300 rounded-lg h-32 bg-gray-50"
            />
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <CheckCircle className="text-green-500" size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}