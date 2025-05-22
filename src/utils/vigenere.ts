export function vigenereCipher(text: string, key: string, decrypt = false): string {
  const keyRepeated = key
    .toUpperCase()
    .repeat(Math.ceil(text.length / key.length))
    .slice(0, text.length);

  return text
    .split('')
    .map((char, i) => {
      if (char.match(/[a-zA-Z]/)) {
        const isUpperCase = char === char.toUpperCase();
        const textChar = char.toUpperCase();
        const keyChar = keyRepeated[i];
        const textCode = textChar.charCodeAt(0) - 65;
        const keyCode = keyChar.charCodeAt(0) - 65;
        let result;

        if (decrypt) {
          result = (textCode - keyCode + 26) % 26;
        } else {
          result = (textCode + keyCode) % 26;
        }

        const resultChar = String.fromCharCode(result + 65);
        return isUpperCase ? resultChar : resultChar.toLowerCase();
      }
      return char;
    })
    .join('');
}