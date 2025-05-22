import React, { useState } from 'react';
import { Lock, Unlock, Copy, CheckCircle, FileText, Key } from 'lucide-react';
import type { Algorithm } from '../utils/types';
import { algorithms } from '../utils/advanced-crypto';
import { encryptText } from '../utils/advanced-crypto';
import FileEncryption from './FileEncryption';
import PasswordGenerator from './PasswordGenerator';

export default function EncryptionForm() {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithm>('AES');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [showFileEncryption, setShowFileEncryption] = useState(false);

  const needsKey = ['AES', 'DES', 'RC4', 'BLOWFISH'].includes(algorithm);
  const needsShift = algorithm === 'CAESAR';
  const needsVigenereKey = algorithm === 'VIGENERE';

  const clearFields = () => {
    setInput('');
    setKey('');
    setResult('');
    setCopied(false);
  };

  const handleModeChange = (newMode: 'encrypt' | 'decrypt') => {
    if (mode !== newMode) {
      setMode(newMode);
      clearFields();
    }
  };

  const handleAlgorithmChange = (newAlgorithm: Algorithm) => {
    setAlgorithm(newAlgorithm);
    clearFields();
  };

  const handleProcess = () => {
    if (!input) return;
    if ((needsKey || needsVigenereKey) && !key) return;
    if (needsShift && !key) return;

    try {
      const processed = encryptText(input, key, algorithm, mode === 'decrypt');
      setResult(processed);
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
    <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-90">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {mode === 'encrypt' ? 'Encryption' : 'Decryption'} System
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => handleModeChange('encrypt')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                mode === 'encrypt'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Lock size={18} /> Encrypt
            </button>
            <button
              onClick={() => handleModeChange('decrypt')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                mode === 'decrypt'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Unlock size={18} /> Decrypt
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setShowFileEncryption(false)}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              !showFileEncryption ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <FileText size={18} /> Text {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
          </button>
          <button
            onClick={() => setShowFileEncryption(true)}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              showFileEncryption ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Key size={18} /> File {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => handleAlgorithmChange(e.target.value as Algorithm)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {Object.entries(algorithms).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {(needsKey || needsVigenereKey || needsShift) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {needsShift ? 'Shift Value' : needsVigenereKey ? 'Vigenère Key' : `${mode === 'encrypt' ? 'Encryption' : 'Decryption'} Key`}
              </label>
              <input
                type={needsShift ? 'number' : 'text'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={
                  needsShift
                    ? 'Enter shift value (e.g. 3)'
                    : needsVigenereKey
                    ? 'Enter Vigenère key'
                    : `Enter ${mode === 'encrypt' ? 'encryption' : 'decryption'} key`
                }
              />
            </div>
          )}

          {showFileEncryption ? (
            <FileEncryption 
              algorithm={algorithm} 
              encryptionKey={key} 
              mode={mode}
            />
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input Text
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
            </>
          )}
        </div>

        <PasswordGenerator />
      </div>
    </div>
  );
}