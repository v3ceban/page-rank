/**
 * Calculates PageRank values for a network of nodes using the iterative algorithm.
 *
 * @param {string[]} data Array of strings representing nodes in format
 *                        "source:target1,target2,...".
 *
 * @param {number} d Damping factor (float between 0 and 1, typically 0.85)
 *                   that represents the probability of following a link (d)
 *                   or jumping to a random node (1-d).
 *
 * @returns {Object} Object containing the following properties:
 *                   - iterations: Number of iterations it took until convergence
 *                   - sum: Sum of all PageRank values
 *                   - pageRank: Array of PageRank values for each node
 *
 * @description
 * The algorithm:
 * 1. Builds the graph structure from input data
 * 2. Identifies dangling nodes (nodes with no outgoing links)
 * 3. Iteratively calculates PageRank until convergence: ideally when diff is 0,
 *    but realistically when max diff < a small tolerance (1e-10).
 * 4. Uses PageRank formula: PR(p) = d * (sum(PR(i)/C(i)) + danglingScore) + (1 - d) / N
 *    where:
 *    - PR(p) is the PageRank of page p
 *    - N is the total number of nodes
 *    - PR(i) is the PageRank of nodes linking to p
 *    - C(i) is the number of outbound links from node i
 *
 * @author Vladimir Ceban
 * @license GNU GPL v3
 */
export const getPageRank = (data, d) => {
  const nodeSet = new Set();

  for (const line of data) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const sourceNode = line.slice(0, colonIndex).trim();
    nodeSet.add(sourceNode);

    const targets = line
      .slice(colonIndex + 1)
      .trim()
      .split(",");
    for (const target of targets) {
      nodeSet.add(target.trim());
    }
  }

  const sortedNodes = [...nodeSet].sort((a, b) =>
    +a === +a && +b === +b ? +a - +b : a.localeCompare(b),
  );
  const nodeCount = sortedNodes.length;
  const nodeIndexMap = new Map(sortedNodes.map((node, idx) => [node, idx]));

  const outDegrees = new Uint32Array(nodeCount);
  const outLinks = Array.from({ length: nodeCount }, () => []);

  for (const line of data) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const sourceNode = line.slice(0, colonIndex).trim();
    const sourceIdx = nodeIndexMap.get(sourceNode);
    const targets = line
      .slice(colonIndex + 1)
      .trim()
      .split(",");

    for (const target of targets) {
      const targetIdx = nodeIndexMap.get(target.trim());
      outLinks[sourceIdx].push(targetIdx);
    }
    outDegrees[sourceIdx] = targets.length;
  }

  const danglingNodes = [];
  for (let i = 0; i < nodeCount; i++) {
    if (outDegrees[i] === 0) {
      danglingNodes.push(i);
    }
  }

  const TOLERANCE = 1e-10;
  const BASE_SCORE = (1 - d) / nodeCount;

  let pageRank = new Float64Array(nodeCount);
  let newPageRank = new Float64Array(nodeCount);
  const initialScore = 1 / nodeCount;
  pageRank.fill(initialScore);

  let iterations = 0;

  while (true) {
    iterations++;

    let danglingScore = 0;
    for (const nodeIdx of danglingNodes) {
      danglingScore += pageRank[nodeIdx];
    }
    danglingScore = (d * danglingScore) / nodeCount;

    newPageRank.fill(BASE_SCORE + danglingScore);

    for (let i = 0; i < nodeCount; i++) {
      const outDeg = outDegrees[i];
      if (outDeg === 0) continue;
      const contribution = d * (pageRank[i] / outDeg);
      const targets = outLinks[i];
      for (let j = 0, tLen = targets.length; j < tLen; j++) {
        newPageRank[targets[j]] += contribution;
      }
    }

    let maxDiff = 0;
    for (let i = 0; i < nodeCount; i++) {
      maxDiff = Math.max(maxDiff, Math.abs(newPageRank[i] - pageRank[i]));
    }

    if (maxDiff < TOLERANCE) break;

    [pageRank, newPageRank] = [newPageRank, pageRank];
  }

  const sum = pageRank.reduce((acc, val) => acc + val, 0);

  return {
    iterations,
    sum,
    pageRank: Array.from(pageRank, (val) => val.toExponential(10)),
  };
};
