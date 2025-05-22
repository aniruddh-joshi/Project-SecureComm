import CryptoJS from 'crypto-js';

export async function encryptFile(file: File, key: string, algorithm: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }

        // Convert ArrayBuffer to Base64 string
        const arrayBuffer = e.target.result as ArrayBuffer;
        const base64String = arrayBufferToBase64(arrayBuffer);
        
        let encrypted;
        switch (algorithm) {
          case 'AES':
            encrypted = CryptoJS.AES.encrypt(base64String, key);
            break;
          case 'DES':
            encrypted = CryptoJS.TripleDES.encrypt(base64String, key);
            break;
          case 'RC4':
            encrypted = CryptoJS.RC4.encrypt(base64String, key);
            break;
          case 'BLOWFISH':
            encrypted = CryptoJS.Rabbit.encrypt(base64String, key);
            break;
          default:
            throw new Error('Unsupported algorithm for file encryption');
        }

        // Store algorithm info with encrypted data
        const encryptedData = JSON.stringify({
          algorithm,
          data: encrypted.toString()
        });
        
        const blob = new Blob([encryptedData], { type: 'application/encrypted' });
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export async function decryptFile(file: File, key: string, algorithm: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }

        // Parse the encrypted data
        const text = new TextDecoder().decode(e.target.result as ArrayBuffer);
        const { algorithm: storedAlgorithm, data: encryptedData } = JSON.parse(text);

        // Verify algorithm matches
        if (storedAlgorithm !== algorithm) {
          throw new Error(`File was encrypted with ${storedAlgorithm}, but trying to decrypt with ${algorithm}`);
        }

        let decrypted;
        switch (algorithm) {
          case 'AES':
            decrypted = CryptoJS.AES.decrypt(encryptedData, key);
            break;
          case 'DES':
            decrypted = CryptoJS.TripleDES.decrypt(encryptedData, key);
            break;
          case 'RC4':
            decrypted = CryptoJS.RC4.decrypt(encryptedData, key);
            break;
          case 'BLOWFISH':
            decrypted = CryptoJS.Rabbit.decrypt(encryptedData, key);
            break;
          default:
            throw new Error('Unsupported algorithm for file decryption');
        }

        // Convert decrypted base64 back to binary
        const base64 = decrypted.toString(CryptoJS.enc.Utf8);
        const binary = base64ToArrayBuffer(base64);
        
        resolve(new Blob([binary]));
      } catch (error) {
        reject(new Error('Failed to decrypt file. Please check your key and algorithm.'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper function to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}