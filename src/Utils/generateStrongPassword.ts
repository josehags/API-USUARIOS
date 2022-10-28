export function generateStrongPassword(size: number) {
  const numbers = [48, 57];
  const upperchars = [65, 90];
  const lowerchars = [97, 122];
  const especialchars = [
    33, 35, 36, 37, 38, 40, 41, 42, 45, 46, 47, 63, 64, 91, 93, 94, 95, 123,
    124, 125, 126,
  ];
  const ascii = [numbers, upperchars, lowerchars, especialchars];
  let pass = '';
  for (let i = 0; i < size; i++) {
    const type = parseInt(String(Math.random() * ascii.length));
    if (type === 3) {
      pass += String.fromCharCode(
        especialchars[parseInt(String(Math.random() * especialchars.length))],
      );
    } else {
      pass += String.fromCharCode(
        Math.floor(Math.random() * (ascii[type][1] - ascii[type][0])) +
          ascii[type][0],
      );
    }
  }
  return pass;
}
