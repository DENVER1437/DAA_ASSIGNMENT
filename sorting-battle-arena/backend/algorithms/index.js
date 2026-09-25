const bubbleSort = require('./bubbleSort');
const selectionSort = require('./selectionSort');
const insertionSort = require('./insertionSort');
const mergeSort = require('./mergeSort');
const quickSort = require('./quickSort');
const heapSort = require('./heapSort');
const { runStabilityDemo } = require('./stabilityDemo');

const algorithmsMap = {
  bubble: { id: 'bubble', name: 'Bubble Sort', fn: bubbleSort },
  selection: { id: 'selection', name: 'Selection Sort', fn: selectionSort },
  insertion: { id: 'insertion', name: 'Insertion Sort', fn: insertionSort },
  merge: { id: 'merge', name: 'Merge Sort', fn: mergeSort },
  quick: { id: 'quick', name: 'Quick Sort', fn: quickSort },
  heap: { id: 'heap', name: 'Heap Sort', fn: heapSort }
};

/**
 * Run a specific algorithm on an array
 */
function runSort(algoKey, array, order = 'asc', recordSteps = true, maxSteps = 3000) {
  const normalizedKey = (algoKey || '').toLowerCase().replace(/[\s_-]/g, '');
  let target = null;

  for (const key of Object.keys(algorithmsMap)) {
    if (normalizedKey.includes(key)) {
      target = algorithmsMap[key];
      break;
    }
  }

  if (!target) {
    throw new Error(`Unknown algorithm: ${algoKey}. Available: ${Object.keys(algorithmsMap).join(', ')}`);
  }

  return target.fn(array, order, recordSteps, maxSteps);
}

/**
 * Run benchmark across all 6 manual algorithms
 */
function runBenchmark(array, order = 'asc') {
  const results = [];
  const n = array.length;

  // For very large arrays (> 15000), omit steps recording to avoid memory overhead
  const recordSteps = n <= 200;
  const maxSteps = 500;

  for (const [key, algo] of Object.entries(algorithmsMap)) {
    // For quadratic sorts on very large arrays, we run or warn if huge
    let res;
    if (n > 30000 && (key === 'bubble' || key === 'selection' || key === 'insertion')) {
      // Estimate or skip quadratic on massive size to prevent hanging Render/Vercel server
      res = {
        algorithm: algo.name,
        sortedArray: null,
        comparisons: Math.floor((n * (n - 1)) / 2),
        swaps: Math.floor(n * 10),
        executionTimeMs: 99999,
        skipped: true,
        reason: 'O(N²) skipped on N > 30,000 to prevent server timeout',
        complexity: algo.fn([], 'asc', false).complexity
      };
    } else {
      res = algo.fn(array, order, recordSteps, maxSteps);
    }

    results.push({
      id: key,
      name: algo.name,
      comparisons: res.comparisons,
      swaps: res.swaps,
      executionTimeMs: res.executionTimeMs,
      complexity: res.complexity,
      skipped: res.skipped || false,
      reason: res.reason || null
    });
  }

  // Determine leaderboard: sort by executionTimeMs ascending (manual sort without .sort()!)
  for (let i = 0; i < results.length - 1; i++) {
    for (let j = 0; j < results.length - i - 1; j++) {
      if (results[j].executionTimeMs > results[j + 1].executionTimeMs) {
        const temp = results[j];
        results[j] = results[j + 1];
        results[j + 1] = temp;
      }
    }
  }

  const winner = results[0];

  return {
    datasetSize: n,
    order,
    leaderboard: results,
    winner: winner ? { name: winner.name, time: winner.executionTimeMs, comparisons: winner.comparisons } : null
  };
}

module.exports = {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  runStabilityDemo,
  runSort,
  runBenchmark,
  algorithmsMap
};
