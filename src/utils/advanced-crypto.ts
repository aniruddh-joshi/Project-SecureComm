import CryptoJS from 'crypto-js';
import { caesarCipher } from './caesar';
import { vigenereCipher } from './vigenere';

export const algorithms = {
  AES: 'AES-256',
  DES: 'Triple DES',
  RC4: 'RC4 Stream Cipher',
  BLOWFISH: 'Blowfish',
  CAESAR: 'Caesar Cipher',
  VIGENERE: 'Vigenère Cipher',
} as const;

export function encryptText(text: string, key: string, algorithm: string, isDecrypt = false): string {
  switch (algorithm) {
    case 'AES':
      return isDecrypt
        ? CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8)
        : CryptoJS.AES.encrypt(text, key).toString();
    case 'DES':
      return isDecrypt
        ? CryptoJS.TripleDES.decrypt(text, key).toString(CryptoJS.enc.Utf8)
        : CryptoJS.TripleDES.encrypt(text, key).toString();
    case 'RC4':
      return isDecrypt
        ? CryptoJS.RC4.decrypt(text, key).toString(CryptoJS.enc.Utf8)
        : CryptoJS.RC4.encrypt(text, key).toString();
    case 'BLOWFISH':
      return isDecrypt
        ? CryptoJS.Rabbit.decrypt(text, key).toString(CryptoJS.enc.Utf8)
        : CryptoJS.Rabbit.encrypt(text, key).toString();
    case 'CAESAR':
      return caesarCipher(text, parseInt(key) || 3, isDecrypt);
    case 'VIGENERE':
      return vigenereCipher(text, key || 'KEY', isDecrypt);
    default:
      throw new Error('Unsupported algorithm');
  }
}

export async function encryptFile(file: File, key: string, algorithm: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }

        const wordArray = CryptoJS.lib.WordArray.create(e.target.result as any);
        let encrypted;
        
        switch (algorithm) {
          case 'AES':
            encrypted = CryptoJS.AES.encrypt(wordArray, key);
            break;
          case 'DES':
            encrypted = CryptoJS.TripleDES.encrypt(wordArray, key);
            break;
          default:
            throw new Error('Unsupported algorithm for file encryption');
        }
        
        const encryptedArray = encrypted.ciphertext.words;
        const uInt8Array = new Uint8Array(encryptedArray.length * 4);
        
        for (let i = 0; i < encryptedArray.length; i++) {
          const word = encryptedArray[i];
          uInt8Array[i * 4] = (word >> 24) & 0xff;
          uInt8Array[i * 4 + 1] = (word >> 16) & 0xff;
          uInt8Array[i * 4 + 2] = (word >> 8) & 0xff;
          uInt8Array[i * 4 + 3] = word & 0xff;
        }
        
        resolve(new Blob([uInt8Array], { type: 'application/octet-stream' }));
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}