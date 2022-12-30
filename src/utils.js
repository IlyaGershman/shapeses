export function generateRandomArray(max, size) {
  // Initialize the set of picked elements
  const pickedElementsSet = new Set();

  // Use a while loop to pick 4 random and unique elements
  while (pickedElementsSet.size < size) {
    // Pick a random element
    const element = Math.floor(Math.random() * max);

    // Add the element to the set if it is not already present
    pickedElementsSet.add(element);
  }

  // Convert the set to an array and return it
  return [...pickedElementsSet];
}

export function randomlyPickFromArray(array, size) {
  return generateRandomArray(array.length, size).map((index) => array[index]);
}
