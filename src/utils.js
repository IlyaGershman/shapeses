export function randomlyPickFromArray(array, n) {
  return array.sort(() => 0.5 - Math.random()).slice(0, n);
}
