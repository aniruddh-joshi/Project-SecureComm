import React, { useState, useCallback } from 'react';
import { FileUp, Download, AlertCircle } from 'lucide-react';
import { encryptFile, decryptFile } from '../utils/file-crypto';

interface FileEncryptionProps {
  algorithm: string;
  encryptionKey: string;
  mode: 'encrypt' | 'decrypt';
}

export default function FileEncryption({ algorithm, encryptionKey, mode }: FileEncryptionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, [mode]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (mode === 'decrypt' && !file.name.endsWith('.encrypted')) {
      setError('Please select a valid encrypted file (with .encrypted extension)');
      setFile(null);
      return;
    }

    // Check file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      setFile(null);
      return;
    }

    setError(null);
    setFile(file);
  };

  const handleProcess = async () => {
    if (!file || !encryptionKey) return;

    try {
      setIsProcessing(true);
      setError(null);

      let processedBlob: Blob;
      if (mode === 'encrypt') {
        processedBlob = await encryptFile(file, encryptionKey, algorithm);
        downloadFile(processedBlob, `${file.name}.encrypted`);
      } else {
        processedBlob = await decryptFile(file, encryptionKey, algorithm);
        // Remove .encrypted extension for decrypted file
        const originalName = file.name.replace('.encrypted', '');
        downloadFile(processedBlob, `decrypted_${originalName}`);
      }
    } catch (error) {
      console.error('File processing failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-500'
        }`}
      >
        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop a file here, or{' '}
          <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
            browse
            <input
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept={mode === 'decrypt' ? '.encrypted' : '*/*'}
            />
          </label>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {mode === 'encrypt' 
            ? 'Supports any file type up to 50MB'
            : 'Select a previously encrypted file (.encrypted)'}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
          <AlertCircle size={18} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {file && !error && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={handleProcess}
              disabled={isProcessing || !encryptionKey}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={18} />
              {isProcessing ? 'Processing...' : `${mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} & Download`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}