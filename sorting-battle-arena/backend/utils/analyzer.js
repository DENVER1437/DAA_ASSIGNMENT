/**
 * Dataset Analyzer Utility for DAA Assignment.
 * Pre-analyzes dataset metrics and predicts the best sorting algorithm
 * based on algorithmic characteristics and data distribution.
 */

function analyzeDataset(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return {
      size: 0,
      min: 0,
      max: 0,
      range: 0,
      mean: 0,
      duplicateCount: 0,
      duplicatePercentage: 0,
      alreadySortedPercentage: 0,
      reverseSortedPercentage: 0,
      entropy: 'Empty',
      estimatedBestAlgorithm: 'None',
      reasoning: 'Dataset is empty.'
    };
  }

  const n = arr.length;
  let min = arr[0];
  let max = arr[0];
  let sum = 0;
  const freqMap = {};
  let ascPairs = 0;
  let descPairs = 0;

  for (let i = 0; i < n; i++) {
    const val = Number(arr[i]);
    if (val < min) min = val;
    if (val > max) max = val;
    sum += val;

    freqMap[val] = (freqMap[val] || 0) + 1;

    if (i > 0) {
      const prev = Number(arr[i - 1]);
      if (prev <= val) ascPairs++;
      if (prev >= val) descPairs++;
    }
  }

  const mean = Number((sum / n).toFixed(2));
  const range = max - min;

  // Duplicates calculation
  let duplicateElementsCount = 0;
  for (const count of Object.values(freqMap)) {
    if (count > 1) {
      duplicateElementsCount += count;
    }
  }

  const duplicatePercentage = Number(((duplicateElementsCount / n) * 100).toFixed(1));
  const alreadySortedPercentage = n > 1 ? Number(((ascPairs / (n - 1)) * 100).toFixed(1)) : 100;
  const reverseSortedPercentage = n > 1 ? Number(((descPairs / (n - 1)) * 100).toFixed(1)) : 100;

  // Algorithmic prediction logic
  let estimatedBest = 'Quick Sort';
  let reasoning = 'For general random distributions, Quick Sort typically achieves highest throughput due to cache locality and low constant factors.';

  if (n <= 35) {
    estimatedBest = 'Insertion Sort';
    reasoning = `Small dataset (N = ${n}). Insertion Sort has minimal overhead, zero recursion cost, and performs faster than O(N log N) divide-and-conquer on tiny arrays.`;
  } else if (alreadySortedPercentage >= 85) {
    estimatedBest = 'Insertion Sort';
    reasoning = `Array is already ${alreadySortedPercentage}% sorted. Insertion Sort runs in near-linear O(N) time on nearly-sorted data with almost zero swaps.`;
  } else if (duplicatePercentage >= 50) {
    estimatedBest = 'Merge Sort';
    reasoning = `High duplicate ratio (${duplicatePercentage}% duplicates). Merge Sort guarantees O(N log N) performance and preserves element stability.`;
  } else if (reverseSortedPercentage >= 90) {
    estimatedBest = 'Heap Sort';
    reasoning = `Array is strongly reverse-sorted (${reverseSortedPercentage}%). Heap Sort avoids recursion overhead and guarantees O(N log N) in-place.`;
  } else if (n > 5000) {
    estimatedBest = 'Quick Sort';
    reasoning = `Large dataset (N = ${n}). Quick Sort with median-of-three pivot excels in memory cache performance and partition speed.`;
  }

  return {
    size: n,
    min,
    max,
    range,
    mean,
    duplicateCount: duplicateElementsCount,
    duplicatePercentage,
    alreadySortedPercentage,
    reverseSortedPercentage,
    entropy: duplicatePercentage > 60 ? 'Low (Redundant)' : alreadySortedPercentage > 80 ? 'Ordered' : 'High (Random)',
    estimatedBestAlgorithm: estimatedBest,
    reasoning
  };
}

module.exports = {
  analyzeDataset
};
