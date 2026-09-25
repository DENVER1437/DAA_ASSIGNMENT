/**
 * Client-Side Manual Sorting Algorithms for Instant 60FPS Interactive Visualizer.
 * Strictly adheres to manual implementations with comparisons, swaps, and frame steps.
 * ZERO use of built-in Array.prototype.sort!
 */

export const ALGORITHM_DETAILS = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    tagline: 'Elementary swap-based sort',
    timeComplexity: { best: 'O(N)', avg: 'O(N²)', worst: 'O(N²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    color: 'from-blue-500 to-cyan-500',
    accentColor: '#3B82F6',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Passes through the list are repeated until the list is sorted.'
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    tagline: 'In-place minimum extraction',
    timeComplexity: { best: 'O(N²)', avg: 'O(N²)', worst: 'O(N²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    color: 'from-amber-500 to-orange-500',
    accentColor: '#F59E0B',
    description: 'Divides the input list into two parts: a sorted sublist of items built up from left to right and a sublist of remaining unsorted items. Finds the minimum element and places it at the beginning.'
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    tagline: 'Adaptive incremental builder',
    timeComplexity: { best: 'O(N)', avg: 'O(N²)', worst: 'O(N²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    color: 'from-emerald-500 to-teal-500',
    accentColor: '#10B981',
    description: 'Builds the final sorted array one item at a time. It is highly efficient for small data and nearly sorted sets, running in linear O(N) time with minimal comparisons.'
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    tagline: 'Guaranteed O(N log N) divide & conquer',
    timeComplexity: { best: 'O(N log N)', avg: 'O(N log N)', worst: 'O(N log N)' },
    spaceComplexity: 'O(N)',
    stable: true,
    color: 'from-purple-500 to-indigo-500',
    accentColor: '#8B5CF6',
    description: 'An efficient, stable, comparison-based divide and conquer algorithm. Divides array into equal halves, recursively sorts them, and merges sorted subarrays.'
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    tagline: 'Cache-friendly high-performance sort',
    timeComplexity: { best: 'O(N log N)', avg: 'O(N log N)', worst: 'O(N²)' },
    spaceComplexity: 'O(log N)',
    stable: false,
    color: 'from-pink-500 to-rose-500',
    accentColor: '#EC4899',
    description: 'Selects a "pivot" element and partitions the array into values smaller than pivot and values greater than pivot, recursively repeating the process.'
  },
  heap: {
    id: 'heap',
    name: 'Heap Sort',
    tagline: 'Optimal O(N log N) in-place binary heap',
    timeComplexity: { best: 'O(N log N)', avg: 'O(N log N)', worst: 'O(N log N)' },
    spaceComplexity: 'O(1)',
    stable: false,
    color: 'from-violet-500 to-cyan-500',
    accentColor: '#06B6D4',
    description: 'Converts array into a binary max-heap, then iteratively removes maximum element from root to place it at the end of the array, restoring heap property each time.'
  }
};

/**
 * Generate visual steps for interactive animation:
 * Each step has:
 * - array: snapshot of the array
 * - comparing: array of indices currently being compared (yellow)
 * - swapping: array of indices currently being swapped (pink)
 * - sorted: array of indices that are finalized (green)
 * - pivot: index of pivot element (cyan/purple)
 * - comparisons: count so far
 * - swaps: count so far
 * - message: explanation
 */
export function generateVisualSteps(algoId, initialArray, order = 'asc') {
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set();

  const record = (comparing = [], swapping = [], pivot = null, message = '') => {
    steps.push({
      array: [...arr],
      comparing: [...comparing],
      swapping: [...swapping],
      sorted: Array.from(sortedIndices),
      pivot,
      comparisons,
      swaps,
      message
    });
  };

  record([], [], null, 'Initial array loaded');

  if (algoId === 'bubble') {
    let swapped;
    for (let i = 0; i < n - 1; i++) {
      swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        record([j, j + 1], [], null, `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})`);
        
        const needSwap = order === 'asc' ? arr[j] > arr[j + 1] : arr[j] < arr[j + 1];
        if (needSwap) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swaps++;
          swapped = true;
          record([], [j, j + 1], null, `Swapped arr[${j}] and arr[${j + 1}]`);
        }
      }
      sortedIndices.add(n - 1 - i);
      if (!swapped) break;
    }
    for (let k = 0; k < n; k++) sortedIndices.add(k);
    record([], [], null, 'Bubble sort finished');
  } else if (algoId === 'selection') {
    for (let i = 0; i < n - 1; i++) {
      let targetIdx = i;
      record([i], [], null, `Target pass ${i + 1}: current minimum at index ${i}`);

      for (let j = i + 1; j < n; j++) {
        comparisons++;
        record([j, targetIdx], [], null, `Comparing arr[${j}] (${arr[j]}) with candidate arr[${targetIdx}] (${arr[targetIdx]})`);
        const better = order === 'asc' ? arr[j] < arr[targetIdx] : arr[j] > arr[targetIdx];
        if (better) {
          targetIdx = j;
        }
      }

      if (targetIdx !== i) {
        const temp = arr[i];
        arr[i] = arr[targetIdx];
        arr[targetIdx] = temp;
        swaps++;
        record([], [i, targetIdx], null, `Swapped index ${i} with min at index ${targetIdx}`);
      }
      sortedIndices.add(i);
    }
    for (let k = 0; k < n; k++) sortedIndices.add(k);
    record([], [], null, 'Selection sort finished');
  } else if (algoId === 'insertion') {
    sortedIndices.add(0);
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      record([i], [], null, `Picked key ${key} at index ${i}`);

      while (j >= 0) {
        comparisons++;
        const shouldShift = order === 'asc' ? arr[j] > key : arr[j] < key;
        if (shouldShift) {
          arr[j + 1] = arr[j];
          swaps++;
          record([j], [j, j + 1], null, `Shifted ${arr[j]} forward to index ${j + 1}`);
          j--;
        } else {
          break;
        }
      }
      arr[j + 1] = key;
      swaps++;
      sortedIndices.add(i);
      record([], [j + 1], null, `Inserted key ${key} at position ${j + 1}`);
    }
    for (let k = 0; k < n; k++) sortedIndices.add(k);
    record([], [], null, 'Insertion sort finished');
  } else if (algoId === 'merge') {
    function merge(l, m, r) {
      const leftPart = arr.slice(l, m + 1);
      const rightPart = arr.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;

      while (i < leftPart.length && j < rightPart.length) {
        comparisons++;
        record([l + i, m + 1 + j], [], null, `Comparing left (${leftPart[i]}) and right (${rightPart[j]})`);
        const pickLeft = order === 'asc' ? leftPart[i] <= rightPart[j] : leftPart[i] >= rightPart[j];
        if (pickLeft) {
          arr[k] = leftPart[i];
          i++;
        } else {
          arr[k] = rightPart[j];
          j++;
        }
        swaps++;
        record([], [k], null, `Merged element into index ${k}`);
        k++;
      }

      while (i < leftPart.length) {
        arr[k] = leftPart[i];
        swaps++;
        record([], [k], null, `Copied left remainder to index ${k}`);
        i++;
        k++;
      }
      while (j < rightPart.length) {
        arr[k] = rightPart[j];
        swaps++;
        record([], [k], null, `Copied right remainder to index ${k}`);
        j++;
        k++;
      }

      if (l === 0 && r === n - 1) {
        for (let x = 0; x < n; x++) sortedIndices.add(x);
      }
    }

    function mergeSortRecursive(l, r) {
      if (l < r) {
        const m = Math.floor((l + r) / 2);
        mergeSortRecursive(l, m);
        mergeSortRecursive(m + 1, r);
        merge(l, m, r);
      }
    }

    mergeSortRecursive(0, n - 1);
    for (let k = 0; k < n; k++) sortedIndices.add(k);
    record([], [], null, 'Merge sort finished');
  } else if (algoId === 'quick') {
    function partition(low, high) {
      const pivot = arr[high];
      record([], [], high, `Pivot chosen: ${pivot} at index ${high}`);
      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        record([j, high], [], high, `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot})`);
        const moveLeft = order === 'asc' ? arr[j] < pivot : arr[j] > pivot;
        if (moveLeft) {
          i++;
          if (i !== j) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            swaps++;
            record([], [i, j], high, `Swapped arr[${i}] and arr[${j}]`);
          }
        }
      }

      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      swaps++;
      sortedIndices.add(i + 1);
      record([], [i + 1, high], null, `Pivot ${pivot} placed into position ${i + 1}`);
      return i + 1;
    }

    function quickSortRecursive(low, high) {
      if (low < high) {
        const pi = partition(low, high);
        quickSortRecursive(low, pi - 1);
        quickSortRecursive(pi + 1, high);
      } else if (low === high) {
        sortedIndices.add(low);
      }
    }

    quickSortRecursive(0, n - 1);
    for (let k = 0; k < n; k++) sortedIndices.add(k);
    record([], [], null, 'Quick sort finished');
  } else if (algoId === 'heap') {
    function heapify(size, rootIdx) {
      let largest = rootIdx;
      const left = 2 * rootIdx + 1;
      const right = 2 * rootIdx + 2;

      if (left < size) {
        comparisons++;
        record([left, largest], [], null, `Comparing left child with root`);
        const elevateLeft = order === 'asc' ? arr[left] > arr[largest] : arr[left] < arr[largest];
        if (elevateLeft) largest = left;
      }
      if (right < size) {
        comparisons++;
        record([right, largest], [], null, `Comparing right child with root`);
        const elevateRight = order === 'asc' ? arr[right] > arr[largest] : arr[right] < arr[largest];
        if (elevateRight) largest = right;
      }

      if (largest !== rootIdx) {
        const temp = arr[rootIdx];
        arr[rootIdx] = arr[largest];
        arr[largest] = temp;
        swaps++;
        record([], [rootIdx, largest], null, `Heap swapped root with child`);
        heapify(size, largest);
      }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }
    record([], [], null, 'Max-Heap structure built');

    for (let i = n - 1; i > 0; i--) {
      const temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;
      swaps++;
      sortedIndices.add(i);
      record([], [0, i], null, `Extracted root ${temp} to index ${i}`);
      heapify(i, 0);
    }
    for (let k = 0; k < n; k++) sortedIndices.add(k);
    record([], [], null, 'Heap sort finished');
  }

  return { steps, comparisons, swaps, sortedArray: arr };
}
