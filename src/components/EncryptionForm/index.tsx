import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Algorithm, EncryptionHistory } from '../../utils/types';
import { algorithms } from '../../utils/advanced-crypto';
import { TextEncryption } from './TextEncryption';
import { FileEncryption } from './FileEncryption';
import { ModeToggle } from './ModeToggle';
import { AlgorithmSelect } from './AlgorithmSelect';
import { HistoryDrawer } from '../HistoryDrawer';

export default function EncryptionForm() {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithm>('AES');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [showFileEncryption, setShowFileEncryption] = useState(false);
  const [history, setHistory] = useState<EncryptionHistory[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const clearFields = () => {
    setInput('');
    setKey('');
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

  const addToHistory = (input: string, output: string) => {
    const historyItem: EncryptionHistory = {
      id: uuidv4(),
      timestamp: new Date(),
      algorithm,
      mode,
      inputPreview: input.substring(0, 50) + (input.length > 50 ? '...' : ''),
      outputPreview: output.substring(0, 50) + (output.length > 50 ? '...' : '')
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 10));
  };

  const handleHistorySelect = (item: EncryptionHistory) => {
    setAlgorithm(item.algorithm);
    setMode(item.mode);
    setInput(item.inputPreview);
    setIsHistoryOpen(false);
  };

  return (
    <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-90">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Cryptographic System
          </h2>
          <ModeToggle mode={mode} onModeChange={handleModeChange} />
        </div>

        <AlgorithmSelect 
          algorithm={algorithm} 
          onAlgorithmChange={handleAlgorithmChange}
          showFileEncryption={showFileEncryption}
          onToggleFileEncryption={setShowFileEncryption}
        />

        {showFileEncryption ? (
          <FileEncryption 
            algorithm={algorithm} 
            encryptionKey={key} 
            mode={mode}
          />
        ) : (
          <TextEncryption
            input={input}
            key={key}
            algorithm={algorithm}
            mode={mode}
            onInputChange={setInput}
            onKeyChange={setKey}
            onProcessed={addToHistory}
          />
        )}
      </div>

      <HistoryDrawer 
        history={history} 
        onSelect={handleHistorySelect} 
        isOpen={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />
    </div>
  );
}