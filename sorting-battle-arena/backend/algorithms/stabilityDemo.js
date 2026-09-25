/**
 * Stability Demonstration Module for DAA Assignment.
 * Demonstrates whether an algorithm preserves the relative order of records
 * with equal keys (e.g., Student A with 80 marks vs Student B with 80 marks).
 */

const bubbleSort = require('./bubbleSort');
const selectionSort = require('./selectionSort');
const insertionSort = require('./insertionSort');
const mergeSort = require('./mergeSort');
const quickSort = require('./quickSort');
const heapSort = require('./heapSort');

function runStabilityDemo(customDataset = null) {
  // Default dataset demonstrating stability with duplicate keys
  const defaultItems = [
    { id: 'Student-A', value: 80, name: 'Alice (Roll 101)', tag: 'A' },
    { id: 'Student-B', value: 65, name: 'Bob (Roll 102)', tag: 'B' },
    { id: 'Student-C', value: 80, name: 'Charlie (Roll 103)', tag: 'C' },
    { id: 'Student-D', value: 92, name: 'Diana (Roll 104)', tag: 'D' },
    { id: 'Student-E', value: 80, name: 'Evan (Roll 105)', tag: 'E' },
    { id: 'Student-F', value: 74, name: 'Fiona (Roll 106)', tag: 'F' }
  ];

  const dataset = customDataset || defaultItems;

  const algorithms = [
    { name: 'Bubble Sort', fn: bubbleSort, theoreticalStability: true },
    { name: 'Insertion Sort', fn: insertionSort, theoreticalStability: true },
    { name: 'Merge Sort', fn: mergeSort, theoreticalStability: true },
    { name: 'Selection Sort', fn: selectionSort, theoreticalStability: false },
    { name: 'Quick Sort', fn: quickSort, theoreticalStability: false },
    { name: 'Heap Sort', fn: heapSort, theoreticalStability: false }
  ];

  const results = algorithms.map((algo) => {
    const res = algo.fn(dataset, 'asc', true, 500);

    // Verify stability in practice:
    // Check if elements with equal value maintain their initial relative order
    let isPracticallyStable = true;
    const valueMap = {};

    dataset.forEach((item, idx) => {
      if (!valueMap[item.value]) valueMap[item.value] = [];
      valueMap[item.value].push(item.id);
    });

    const sortedValueMap = {};
    res.sortedArray.forEach((item) => {
      if (!sortedValueMap[item.value]) sortedValueMap[item.value] = [];
      sortedValueMap[item.value].push(item.id);
    });

    for (const val of Object.keys(valueMap)) {
      if (valueMap[val].length > 1) {
        const originalOrder = valueMap[val].join(',');
        const sortedOrder = sortedValueMap[val].join(',');
        if (originalOrder !== sortedOrder) {
          isPracticallyStable = false;
          break;
        }
      }
    }

    return {
      name: algo.name,
      theoreticalStability: algo.theoreticalStability,
      isPracticallyStable,
      sortedArray: res.sortedArray,
      comparisons: res.comparisons,
      swaps: res.swaps,
      executionTimeMs: res.executionTimeMs,
      explanation: algo.theoreticalStability
        ? `${algo.name} is STABLE: elements with identical key (value 80) remain in original relative order (${valueMap[80]?.join(' → ')}).`
        : `${algo.name} is UNSTABLE: long-distance swaps or partitioning can alter relative positions of equal keys.`
    };
  });

  return {
    originalDataset: dataset,
    results
  };
}

module.exports = {
  runStabilityDemo
};
