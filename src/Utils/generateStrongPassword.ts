// export function generateStrongPassword(size: unknown) {
//   const numbers = [48, 57];
//   const upperchars = [65, 90];
//   const lowerchars = [97, 122];
//   const especialchars = [
//     33, 35, 36, 37, 38, 40, 41, 42, 45, 46, 47, 63, 64, 91, 93, 94, 95, 123,
//     124, 125, 126,
//   ];
//   const ascii = [numbers, upperchars, lowerchars, especialchars];
//   let pass = '';
//   for (let i = 0; i < size; i++) {
//     const type = Math.random() * ascii.length;
//     if (type === 3) {
//       pass += String.fromCharCode(
//         especialchars[Math.random() * especialchars.length],
//       );
//     } else {
//       pass += String.fromCharCode(
//         Math.floor(Math.random() * (ascii[type][1] - ascii[type][0])) +
//           ascii[type][0],
//       );
//     }
//   }
//   return pass;
// }
export function generateStrongPassword(params) {
  let tam = Math.floor(Math.random() * 8 + 8);
  let chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!?@#$%&*()[]{}|/+-_';

  if (params) {
    chars = '';
    tam = params.tamanho > 0 ? params.tamanho : 8;
    chars +=
      typeof params.numeros === 'undefined' || params.numeros
        ? '0123456789'
        : '';
    chars +=
      typeof params.simbolos === 'undefined' || params.simbolos
        ? '!?@#$%&*()[]{}|/+-_'
        : '';
    chars +=
      typeof params.maisculo === 'undefined' || params.maisculo
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        : '';
    chars +=
      typeof params.minusculo === 'undefined' || params.minusculo
        ? 'abcdefghijklmnopqrstuvwxyz'
        : '';
    const nao =
      typeof params.naoIncluir !== 'undefined' && params.naoIncluir.length > 0
        ? params.naoIncluir
        : '';

    [...nao].forEach(n => (chars = chars.split(n).join('')));
  }

  return Array(tam)
    .fill(chars)
    .map(x => {
      return x[Math.floor(Math.random() * chars.length)];
    })
    .join('');
}
