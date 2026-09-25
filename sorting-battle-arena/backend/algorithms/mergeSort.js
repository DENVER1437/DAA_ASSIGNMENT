/**
 * Manual implementation of Merge Sort for DAA Assignment.
 * Strictly avoids Array.prototype.sort or built-in functions.
 * Divide & Conquer with O(N log N) guarantee and stability preservation.
 * Returns: sortedArray, comparisons, swaps, executionTimeMs, steps
 */

function mergeSort(inputArray, order = 'asc', recordSteps = true, maxSteps = 3000) {
  const arr = [...inputArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0; // Recorded as array write operations
  const steps = [];

  const getValue = (item) => (typeof item === 'object' && item !== null ? item.value : item);

  const shouldPickLeft = (leftItem, rightItem) => {
    comparisons++;
    const valL = getValue(leftItem);
    const valR = getValue(rightItem);
    // <= for asc ensures stability! >= for desc ensures stability!
    return order === 'asc' ? valL <= valR : valL >= valR;
  };

  const merge = (left, mid, right) => {
    const leftLen = mid - left + 1;
    const rightLen = right - mid;

    // Create temporary arrays manually
    const L = new Array(leftLen);
    const R = new Array(rightLen);

    for (let i = 0; i < leftLen; i++) {
      L[i] = arr[left + i];
    }
    for (let j = 0; j < rightLen; j++) {
      R[j] = arr[mid + 1 + j];
    }

    if (recordSteps && steps.length < maxSteps) {
      steps.push({
        type: 'divide-merge',
        indices: [left, right],
        mid,
        description: `Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`
      });
    }

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftLen && j < rightLen) {
      if (recordSteps && steps.length < maxSteps) {
        steps.push({
          type: 'compare',
          indices: [left + i, mid + 1 + j],
          values: [getValue(L[i]), getValue(R[j])],
          description: `Comparing left sub-element ${getValue(L[i])} and right sub-element ${getValue(R[j])}`
        });
      }

      if (shouldPickLeft(L[i], R[j])) {
        arr[k] = L[i];
        swaps++;
        if (recordSteps && steps.length < maxSteps) {
          steps.push({
            type: 'write',
            indices: [k],
            values: [getValue(L[i])],
            arraySnapshot: arr.length <= 150 ? [...arr] : null,
            description: `Placed ${getValue(L[i])} into index ${k}`
          });
        }
        i++;
      } else {
        arr[k] = R[j];
        swaps++;
        if (recordSteps && steps.length < maxSteps) {
          steps.push({
            type: 'write',
            indices: [k],
            values: [getValue(R[j])],
            arraySnapshot: arr.length <= 150 ? [...arr] : null,
            description: `Placed ${getValue(R[j])} into index ${k}`
          });
        }
        j++;
      }
      k++;
    }

    while (i < leftLen) {
      arr[k] = L[i];
      swaps++;
      if (recordSteps && steps.length < maxSteps) {
        steps.push({
          type: 'write',
          indices: [k],
          values: [getValue(L[i])],
          arraySnapshot: arr.length <= 150 ? [...arr] : null,
          description: `Copied remaining left element ${getValue(L[i])} to index ${k}`
        });
      }
      i++;
      k++;
    }

    while (j < rightLen) {
      arr[k] = R[j];
      swaps++;
      if (recordSteps && steps.length < maxSteps) {
        steps.push({
          type: 'write',
          indices: [k],
          values: [getValue(R[j])],
          arraySnapshot: arr.length <= 150 ? [...arr] : null,
          description: `Copied remaining right element ${getValue(R[j])} to index ${k}`
        });
      }
      j++;
      k++;
    }
  };

  const sortSubarray = (left, right) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      sortSubarray(left, mid);
      sortSubarray(mid + 1, right);
      merge(left, mid, right);
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
      description: 'Merge sort completed successfully'
    });
  }

  const endHr = process.hrtime.bigint();
  const executionTimeMs = Number(endHr - startHr) / 1e6;

  return {
    algorithm: 'Merge Sort',
    sortedArray: arr,
    comparisons,
    swaps,
    executionTimeMs: Number(executionTimeMs.toFixed(4)),
    steps,
    complexity: {
      best: 'O(N log N)',
      average: 'O(N log N)',
      worst: 'O(N log N)',
      space: 'O(N)',
      stable: true
    }
  };
}

module.exports = mergeSort;
