/**
 * Manual implementation of Insertion Sort for DAA Assignment.
 * Strictly avoids Array.prototype.sort or built-in functions.
 * Returns: sortedArray, comparisons, swaps, executionTimeMs, steps
 */

function insertionSort(inputArray, order = 'asc', recordSteps = true, maxSteps = 3000) {
  const arr = [...inputArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0; // In insertion sort, shifts/assignments are recorded
  const steps = [];

  const getValue = (item) => (typeof item === 'object' && item !== null ? item.value : item);

  const shouldShift = (itemInArray, keyItem) => {
    comparisons++;
    const valArr = getValue(itemInArray);
    const valKey = getValue(keyItem);
    return order === 'asc' ? valArr > valKey : valArr < valKey;
  };

  const startHr = process.hrtime.bigint();

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    if (recordSteps && steps.length < maxSteps) {
      steps.push({
        type: 'select-key',
        indices: [i],
        values: [getValue(key)],
        description: `Selected key ${getValue(key)} at index ${i}`
      });
    }

    while (j >= 0 && shouldShift(arr[j], key)) {
      arr[j + 1] = arr[j];
      swaps++;

      if (recordSteps && steps.length < maxSteps) {
        steps.push({
          type: 'shift',
          indices: [j, j + 1],
          values: [getValue(arr[j])],
          arraySnapshot: arr.length <= 150 ? [...arr] : null,
          description: `Shifted element from index ${j} to ${j + 1}`
        });
      }

      j--;
    }

    arr[j + 1] = key;
    if (j + 1 !== i) {
      swaps++;
    }

    if (recordSteps && steps.length < maxSteps) {
      steps.push({
        type: 'insert',
        indices: [j + 1],
        values: [getValue(key)],
        arraySnapshot: arr.length <= 150 ? [...arr] : null,
        description: `Inserted key ${getValue(key)} at position ${j + 1}`
      });
    }
  }

  if (recordSteps && steps.length < maxSteps) {
    const allIndices = Array.from({ length: n }, (_, idx) => idx);
    steps.push({
      type: 'completed',
      indices: allIndices,
      description: 'Insertion sort completed successfully'
    });
  }

  const endHr = process.hrtime.bigint();
  const executionTimeMs = Number(endHr - startHr) / 1e6;

  return {
    algorithm: 'Insertion Sort',
    sortedArray: arr,
    comparisons,
    swaps,
    executionTimeMs: Number(executionTimeMs.toFixed(4)),
    steps,
    complexity: {
      best: 'O(N)',
      average: 'O(N²)',
      worst: 'O(N²)',
      space: 'O(1)',
      stable: true
    }
  };
}

module.exports = insertionSort;
