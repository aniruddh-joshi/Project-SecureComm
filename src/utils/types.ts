export type Algorithm = 'AES' | 'DES' | 'RC4' | 'CAESAR' | 'VIGENERE' | 'BLOWFISH';

export interface EncryptionHistory {
  id: string;
  timestamp: Date;
  algorithm: Algorithm;
  mode: 'encrypt' | 'decrypt';
  inputPreview: string;
  outputPreview: string;
}

export interface FileEncryption {
  name: string;
  size: number;
  type: string;
  content: ArrayBuffer;
}