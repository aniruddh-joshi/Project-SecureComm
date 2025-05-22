export function caesarCipher(text: string, shift: number, decrypt = false): string {
  return text
    .split('')
    .map((char) => {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        const direction = decrypt ? -1 : 1;
        return String.fromCharCode(
          ((code - base + direction * shift + 26) % 26) + base
        );
      }
      return char;
    })
    .join('');
}