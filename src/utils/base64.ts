// Base64 encoding/decoding implementation
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function base64Encode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let result = '';
  let i = 0;
  
  while (i < bytes.length) {
    const chunk = [bytes[i++] || 0, bytes[i++] || 0, bytes[i++] || 0];
    const triplet = (chunk[0] << 16) | (chunk[1] << 8) | chunk[2];
    
    for (let j = 0; j < 4; j++) {
      if (i - 3 + j <= bytes.length) {
        result += chars[(triplet >> (18 - j * 6)) & 0x3f];
      } else {
        result += '=';
      }
    }
  }
  
  return result;
}

export function base64Decode(str: string): string {
  str = str.replace(/[^A-Za-z0-9+/]/g, '');
  const bytes = [];
  
  for (let i = 0; i < str.length; i += 4) {
    const chunk = [
      chars.indexOf(str[i]),
      chars.indexOf(str[i + 1]),
      chars.indexOf(str[i + 2]),
      chars.indexOf(str[i + 3])
    ];
    
    bytes.push(
      ((chunk[0] << 2) | (chunk[1] >> 4)) & 0xff,
      ((chunk[1] << 4) | (chunk[2] >> 2)) & 0xff,
      ((chunk[2] << 6) | chunk[3]) & 0xff
    );
  }
  
  while (bytes[bytes.length - 1] === 0) {
    bytes.pop();
  }
  
  return new TextDecoder().decode(new Uint8Array(bytes));
}