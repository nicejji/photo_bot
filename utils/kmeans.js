export default function KMeans (points, clusterCount) {
  const pointsCount = points.length;
  const propsCount = points[0].length;
  // Init
  const labels = new Array(pointsCount).fill(0)
  const centers = [];
  // KMeans ++ Centers Initialization
  centers.push(points[Math.floor(Math.random() * pointsCount)]);
  for (let cId = 0; cId < clusterCount - 1; cId++) {
    let [maxDistance, maxDistanceIndex] = [-Infinity, 0];
    for (let i = 0; i < pointsCount; i++) {
      let minCenter = Infinity
      for (let j = 0; j < centers.length; j++) {
        let sum = 0;
        for (let k = 0; k < propsCount; k++) sum += (points[i][k] - centers[j][k]) ** 2;
        if (sum ** 0.5 < minCenter) minCenter = sum ** 0.5;
      }
      if (minCenter > maxDistance) [maxDistance, maxDistanceIndex] = [minCenter, i];
    }
    centers.push(points[maxDistanceIndex])
  }
  // Iteratins cycle
  while (true) {
    // labels assignment
    for (let i = 0; i < pointsCount; i++) {
      let [minCenter, minIndex] = [Infinity, 0];
      for (let j = 0; j < clusterCount; j++) {
        let sum = 0
        for (let k = 0; k < propsCount; k++) sum += (points[i][k] - centers[j][k]) ** 2;
        if (sum ** 0.5 < minCenter) [minCenter, minIndex] = [sum ** 0.5, j];
      }
      labels[i] = minIndex
    }
    // centers calculation
    const prevCenters = [...centers];
    for (let i = 0; i < clusterCount; i++) {
      const centroid = new Array(propsCount).fill(0);
      let found = 0;
      for (let j = 0; j < pointsCount; j++) {
        if (labels[j] === i) {
          found += 1;
          for (let k = 0; k < propsCount; k++) centroid[k] += points[j][k];
        }
      }
      centers[i] = centroid.map((x) => x / found);
    }
    // equality centers condition check
    let equal = true;
    outEqual: for (let i = 0; i < clusterCount; i++) {
      for (let j = 0; j < propsCount; j++) {
        if (centers[i][j] !== prevCenters[i][j]) {equal = false; break outEqual}
      }
    }
    if (equal) return [centers, labels];
  }
};

