function calculateMean(values) {
  if (!values || !values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function calculateStandardDeviation(values, mean = null) {
  if (!values || values.length <= 1) return 0;
  const avg = mean !== null ? mean : calculateMean(values);
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function calculateZScore(value, mean, stdDev) {
  if (!stdDev || stdDev === 0) return 0;
  return (value - mean) / stdDev;
}

function movingAverage(values, windowSize = 3) {
  if (!values || values.length === 0) return [];
  const result = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = values.slice(start, i + 1);
    result.push(calculateMean(window));
  }
  return result;
}

module.exports = {
  calculateMean,
  calculateStandardDeviation,
  calculateZScore,
  movingAverage,
};
