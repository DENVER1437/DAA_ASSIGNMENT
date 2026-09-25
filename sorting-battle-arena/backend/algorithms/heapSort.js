/**
 * Manual implementation of Heap Sort for DAA Assignment.
 * Strictly avoids Array.prototype.sort or built-in functions.
 * In-place binary heap with O(N log N) guarantee.
 * Returns: sortedArray, comparisons, swaps, executionTimeMs, steps
 */

function heapSort(inputArray, order = 'asc', recordSteps = true, maxSteps = 3000) {
  const arr = [...inputArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const steps = [];

  const getValue = (item) => (typeof item === 'object' && item !== null ? item.value : item);

  // For asc, we use a max-heap so largest goes to end.
  // For desc, we use a min-heap so smallest goes to end.
  const shouldElevate = (childItem, parentItem) => {
    comparisons++;
    const vC = getValue(childItem);
    const vP = getValue(parentItem);
    return order === 'asc' ? vC > vP : vC < vP;
  };

  const swap = (i, j) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    swaps++;
  };

  const heapify = (size, rootIdx) => {
    let target = rootIdx;
    const leftChild = 2 * rootIdx + 1;
    const rightChild = 2 * rootIdx + 2;

    if (leftChild < size) {
      if (recordSteps && steps.length < maxSteps) {
        steps.push({
          type: 'compare',
          indices: [leftChild, target],
          values: [getValue(arr[leftChild]), getValue(arr[target])],
          description: `Heapify compare left child (${getValue(arr[leftChild])}) with target (${getValue(arr[target])})`
        });
      }
      if (shouldElevate(arr[leftChild], arr[target])) {
        target = leftChild;
      }
    }

    if (rightChild < size) {
      if (recordSteps && steps.length < maxSteps) {
        steps.push({
          type: 'compare',
          indices: [rightChild, target],
          values: [getValue(arr[rightChild]), getValue(arr[target])],
          description: `Heapify compare right child (${getValue(arr[rightChild])}) with target (${getValue(arr[target])})`
        });
      }
      if (shouldElevate(arr[rightChild], arr[target])) {
        target = rightChild;
      }
    }

    if (target !== rootIdx) {
      swap(rootIdx, target);
      if (recordSteps && steps.length < maxSteps) {
        steps.push({
          type: 'swap',
          indices: [rootIdx, target],
          values: [getValue(arr[rootIdx]), getValue(arr[target])],
          arraySnapshot: arr.length <= 150 ? [...arr] : null,
          description: `Heap swap: swapped parent at ${rootIdx} with child at ${target}`
        });
      }
      heapify(size, target);
    }
  };

  const startHr = process.hrtime.bigint();

  // 1. Build max heap (or min heap)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  if (recordSteps && steps.length < maxSteps) {
    steps.push({
      type: 'heap-built',
      indices: [0],
      description: 'Initial binary heap constructed'
    });
  }

  // 2. Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    swap(0, i);
    if (recordSteps && steps.length < maxSteps) {
      steps.push({
        type: 'extract-root',
        indices: [0, i],
        values: [getValue(arr[0]), getValue(arr[i])],
        arraySnapshot: arr.length <= 150 ? [...arr] : null,
        description: `Extracted root ${getValue(arr[i])} to sorted position ${i}`
      });
      steps.push({
        type: 'mark-sorted',
        indices: [i],
        description: `Position ${i} is now locked in sorted state`
      });
    }

    // Call heapify on the reduced heap
    heapify(i, 0);
  }

  if (recordSteps && steps.length < maxSteps) {
    const allIndices = Array.from({ length: n }, (_, idx) => idx);
    steps.push({
      type: 'completed',
      indices: allIndices,
      description: 'Heap sort completed successfully'
    });
  }

  const endHr = process.hrtime.bigint();
  const executionTimeMs = Number(endHr - startHr) / 1e6;

  return {
    algorithm: 'Heap Sort',
    sortedArray: arr,
    comparisons,
    swaps,
    executionTimeMs: Number(executionTimeMs.toFixed(4)),
    steps,
    complexity: {
      best: 'O(N log N)',
      average: 'O(N log N)',
      worst: 'O(N log N)',
      space: 'O(1)',
      stable: false
    }
  };
}

module.exports = heapSort;
