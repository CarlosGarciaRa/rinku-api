// Returns only the values that are in both arrays
export function intersection(arr1: string[], arr2: string[]) {
  const setOne = new Set([...arr1]);
  const setTwo = new Set([...arr2]);

  return [...setOne].filter((i) => setTwo.has(i));
}
// Returns only the values that are not in the second array
export function complement(arr1: string[], arr2: string[]) {
  const setOne = new Set([...arr1]);
  const setTwo = new Set([...arr2]);

  return [...setOne].filter((i) => !setTwo.has(i));
}
