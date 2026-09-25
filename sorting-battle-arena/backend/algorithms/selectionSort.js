/**
 * Manual implementation of Selection Sort for DAA Assignment.
 * Strictly avoids Array.prototype.sort or built-in functions.
 * Returns: sortedArray, comparisons, swaps, executionTimeMs, steps
 */

function selectionSort(inputArray, order = 'asc', recordSteps = true, maxSteps = 3000) {
  const arr = [...inputArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const steps = [];

  const getValue = (item) => (typeof item === 'object' && item !== null ? item.value : item);

  const isBetter = (candidate, currentTarget) => {
    comparisons++;
    const valC = getValue(candidate);
    const valT = getValue(currentTarget);
    return order === 'asc' ? valC < valT : valC > valT;
  };

  const startHr = process.hrtime.bigint();

  for (let i = 0; i < n - 1; i++) {
    let targetIdx = i;

    if (recordSteps && steps.length < maxSteps) {
      steps.push({
        type: 'select-start',
        indices: [i],
        description: `Starting pass ${i + 1}: assuming index ${i} is minimum`
      });
    }

    for (let j = i + 1; j < n; j++) {
      if (recordSteps && steps.length < maxSteps) {
        steps.push({
          type: 'compare',
          indices: [j, targetIdx],
          values: [getValue(arr[j]), getValue(arr[targetIdx])],
          description: `Comparing index ${j} with current target at index ${targetIdx}`
        });
      }

      if (isBetter(arr[j], arr[targetIdx])) {
        targetIdx = j;
        if (recordSteps && steps.length < maxSteps) {
          steps.push({
            type: 'highlight-min',
            indices: [targetIdx],
            description: `New ${order === 'asc' ? 'minimum' : 'maximum'} found at index ${targetIdx}`
          });
        }
      }
    }

    if (targetIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[targetIdx];
      arr[targetIdx] = temp;
      swaps++;

      if (recordSteps && steps.length < maxSteps) {
        steps.push({
          type: 'swap',
          indices: [i, targetIdx],
          values: [getValue(arr[i]), getValue(arr[targetIdx])],
          arraySnapshot: arr.length <= 150 ? [...arr] : null,
          description: `Swapped index ${i} with target at index ${targetIdx}`
        });
      }
    }

    if (recordSteps && steps.length < maxSteps) {
      steps.push({
        type: 'mark-sorted',
        indices: [i],
        description: `Index ${i} is now locked in sorted position`
      });
    }
  }

  if (recordSteps && steps.length < maxSteps) {
    const allIndices = Array.from({ length: n }, (_, idx) => idx);
    steps.push({
      type: 'completed',
      indices: allIndices,
      description: 'Selection sort completed successfully'
    });
  }

  const endHr = process.hrtime.bigint();
  const executionTimeMs = Number(endHr - startHr) / 1e6;

  return {
    algorithm: 'Selection Sort',
    sortedArray: arr,
    comparisons,
    swaps,
    executionTimeMs: Number(executionTimeMs.toFixed(4)),
    steps,
    complexity: {
      best: 'O(N²)',
      average: 'O(N²)',
      worst: 'O(N²)',
      space: 'O(1)',
      stable: false
    }
  };
}

module.exports = selectionSort;
