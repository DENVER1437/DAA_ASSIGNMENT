/**
 * Manual implementation of Bubble Sort for DAA Assignment.
 * Strictly avoids Array.prototype.sort or built-in functions.
 * Returns: sortedArray, comparisons, swaps, executionTimeMs, steps
 */

function bubbleSort(inputArray, order = 'asc', recordSteps = true, maxSteps = 3000) {
  const arr = [...inputArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const steps = [];

  const getValue = (item) => (typeof item === 'object' && item !== null ? item.value : item);

  const shouldSwap = (a, b) => {
    comparisons++;
    const valA = getValue(a);
    const valB = getValue(b);
    return order === 'asc' ? valA > valB : valA < valB;
  };

  const startHr = process.hrtime.bigint();

  let swapped;
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (recordSteps && steps.length < maxSteps) {
        steps.push({
          type: 'compare',
          indices: [j, j + 1],
          values: [getValue(arr[j]), getValue(arr[j + 1])],
          description: `Comparing elements at index ${j} and ${j + 1}`
        });
      }

      if (shouldSwap(arr[j], arr[j + 1])) {
        // Perform manual swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        swapped = true;

        if (recordSteps && steps.length < maxSteps) {
          steps.push({
            type: 'swap',
            indices: [j, j + 1],
            values: [getValue(arr[j]), getValue(arr[j + 1])],
            arraySnapshot: arr.length <= 150 ? [...arr] : null,
            description: `Swapped index ${j} and ${j + 1}`
          });
        }
      }
    }

    if (recordSteps && steps.length < maxSteps) {
      steps.push({
        type: 'mark-sorted',
        indices: [n - 1 - i],
        description: `Element at index ${n - 1 - i} is in its final sorted position`
      });
    }

    // Optimization: If no two elements were swapped, array is already sorted
    if (!swapped) break;
  }

  // Mark remaining as sorted
  if (recordSteps && steps.length < maxSteps) {
    const allIndices = Array.from({ length: n }, (_, idx) => idx);
    steps.push({
      type: 'completed',
      indices: allIndices,
      description: 'Bubble sort completed successfully'
    });
  }

  const endHr = process.hrtime.bigint();
  const executionTimeMs = Number(endHr - startHr) / 1e6;

  return {
    algorithm: 'Bubble Sort',
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

module.exports = bubbleSort;
