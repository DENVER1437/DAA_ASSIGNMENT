/**
 * Dataset generation utilities supporting sizes from 10 to 100,000
 * Types: Random, Already Sorted, Reverse Sorted, Nearly Sorted, Duplicate Heavy
 */

export function generateDataset(size, type = 'random', min = 1, max = 1000) {
  const n = Math.max(5, Math.min(100000, Number(size) || 50));
  const result = new Array(n);

  switch (type) {
    case 'sorted':
      for (let i = 0; i < n; i++) {
        result[i] = Math.round(min + (i / n) * (max - min));
      }
      break;

    case 'reverse':
      for (let i = 0; i < n; i++) {
        result[i] = Math.round(max - (i / n) * (max - min));
      }
      break;

    case 'nearly_sorted':
      for (let i = 0; i < n; i++) {
        result[i] = Math.round(min + (i / n) * (max - min));
      }
      // Introduce roughly 5% swaps to simulate nearly sorted
      const swapCount = Math.max(1, Math.floor(n * 0.05));
      for (let s = 0; s < swapCount; s++) {
        const i1 = Math.floor(Math.random() * n);
        const i2 = Math.min(n - 1, Math.max(0, i1 + Math.floor(Math.random() * 6) - 3));
        const temp = result[i1];
        result[i1] = result[i2];
        result[i2] = temp;
      }
      break;

    case 'duplicate_heavy':
      // Pick from a small set of only 4 to 8 unique values
      const uniqueChoices = [10, 25, 50, 75, 100, 150, 200];
      for (let i = 0; i < n; i++) {
        result[i] = uniqueChoices[Math.floor(Math.random() * uniqueChoices.length)];
      }
      break;

    case 'random':
    default:
      for (let i = 0; i < n; i++) {
        result[i] = Math.floor(Math.random() * (max - min + 1)) + min;
      }
      break;
  }

  return result;
}

/**
 * Format numbers for display (e.g. 1,000 or 100k)
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString();
}
