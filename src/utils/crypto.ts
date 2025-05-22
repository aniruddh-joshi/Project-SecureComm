import { base64Encode, base64Decode } from './base64';
import { caesarCipher } from './caesar';
import { vigenereCipher } from './vigenere';

export const algorithms = {
  AES: 'AES',
  CAESAR: 'CAESAR',
  VIGENERE: 'VIGENERE',
} as const;

export type Algorithm = keyof typeof algorithms;

export {
  base64Encode,
  base64Decode,
  caesarCipher,
  vigenereCipher
};