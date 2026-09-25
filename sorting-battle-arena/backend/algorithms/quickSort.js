/**
 * Manual implementation of Quick Sort for DAA Assignment.
 * Strictly avoids Array.prototype.sort or built-in functions.
 * Uses manual partitioning with pivot highlighting and step tracking.
 * Returns: sortedArray, comparisons, swaps, executionTimeMs, steps
 */

function quickSort(inputArray, order = 'asc', recordSteps = true, maxSteps = 3000) {
  const arr = [...inputArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const steps = [];

  const getValue = (item) => (typeof item === 'object' && item !== null ? item.value : item);

  const shouldMoveLeft = (currentVal, pivotVal) => {
    comparisons++;
    const vC = getValue(currentVal);
    const vP = getValue(pivotVal);
    return order === 'asc' ? vC < vP : vC > vP;
  };

  const swap = (i, j) => {
    if (i === j) return;
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    swaps++;
  };

  const partition = (low, high) => {
    // Median-of-three pivot selection to prevent degradation on sorted/reverse arrays
    const mid = Math.floor((low + high) / 2);
    const vLow = getValue(arr[low]);
    const vMid = getValue(arr[mid]);
    const vHigh = getValue(arr[high]);

    let pivotIdx = high;
    if ((vLow < vMid && vMid < vHigh) || (vHigh < vMid && vMid < vLow)) {
      pivotIdx = mid;
    } else if ((vMid < vLow && vLow < vHigh) || (vHigh < vLow && vLow < vMid)) {
      pivotIdx = low;
    }
    swap(pivotIdx, high);

    const pivot = arr[high];

    if (recordSteps && steps.length < maxSteps) {
      steps.push({
        type: 'pivot',
        indices: [high],
        values: [getValue(pivot)],
        bounds: [low, high],
        description: `Selected pivot ${getValue(pivot)} at index ${high} for range [${low}..${high}]`
      });
    }

    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (recordSteps && steps.length < maxSteps) {
        steps.push({
          type: 'compare',
          indices: [j, high],
          values: [getValue(arr[j]), getValue(pivot)],
          description: `Comparing index ${j} (${getValue(arr[j])}) with pivot (${getValue(pivot)})`
        });
      }

      if (shouldMoveLeft(arr[j], pivot)) {
        i++;
        if (i !== j) {
          swap(i, j);
          if (recordSteps && steps.length < maxSteps) {
            steps.push({
              type: 'swap',
              indices: [i, j],
              values: [getValue(arr[i]), getValue(arr[j])],
              arraySnapshot: arr.length <= 150 ? [...arr] : null,
              description: `Swapped index ${i} and ${j} into left partition`
            });
          }
        }
      }
    }

    swap(i + 1, high);
    if (recordSteps && steps.length < maxSteps) {
      steps.push({
        type: 'pivot-placed',
        indices: [i + 1],
        values: [getValue(arr[i + 1])],
        arraySnapshot: arr.length <= 150 ? [...arr] : null,
        description: `Pivot placed into final position at index ${i + 1}`
      });
    }

    return i + 1;
  };

  const sortSubarray = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      sortSubarray(low, pi - 1);
      sortSubarray(pi + 1, high);
    } else if (low === high && recordSteps && steps.length < maxSteps) {
      steps.push({
        type: 'mark-sorted',
        indices: [low],
        description: `Single element at index ${low} is sorted`
      });
    }
  };

  const startHr = process.hrtime.bigint();
  if (n > 1) {
    sortSubarray(0, n - 1);
  }

  if (recordSteps && steps.length < maxSteps) {
    const allIndices = Array.from({ length: n }, (_, idx) => idx);
    steps.push({
      type: 'completed',
      indices: allIndices,
      description: 'Quick sort completed successfully'
    });
  }

  const endHr = process.hrtime.bigint();
  const executionTimeMs = Number(endHr - startHr) / 1e6;

  return {
    algorithm: 'Quick Sort',
    sortedArray: arr,
    comparisons,
    swaps,
    executionTimeMs: Number(executionTimeMs.toFixed(4)),
    steps,
    complexity: {
      best: 'O(N log N)',
      average: 'O(N log N)',
      worst: 'O(N²)',
      space: 'O(log N)',
      stable: false
    }
  };
}

module.exports = quickSort;
