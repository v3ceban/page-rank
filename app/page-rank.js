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
 * @returns {string[]} Array of PageRank values in scientific notation with 10 decimal places,
 *                     corresponding to the nodes in the input data.
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
  const outLinks = {};
  const inLinks = {};
  const nodeSet = new Set();
  const Tolerance = 1e-10;

  data.forEach((line) => {
    const [sourceStr, targetsStr] = line.split(":");

    if (!sourceStr || !targetsStr) {
      return;
    }

    const sourceNode = sourceStr.trim();

    nodeSet.add(sourceNode);

    const targetNodes = targetsStr
      .trim()
      .split(",")
      .map((t) => t.trim());

    outLinks[sourceNode] = targetNodes;

    targetNodes.forEach((node) => {
      nodeSet.add(node);
      if (!inLinks[node]) {
        inLinks[node] = [];
      }
      inLinks[node].push(sourceNode);
    });
  });

  const sortedNodes = Array.from(nodeSet).sort((a, b) =>
    isNaN(a) || isNaN(b) ? a.localeCompare(b) : Number(a) - Number(b),
  );
  const nodeCount = sortedNodes.length;
  const nodeIndexMap = new Map();
  sortedNodes.forEach((node, index) => nodeIndexMap.set(node, index));

  const danglingNodes = sortedNodes.filter((node) => {
    const links = outLinks[node];
    return !links || links.length === 0;
  });

  let pageRank = new Array(nodeCount).fill(1 / nodeCount);

  while (true) {
    let danglingScore = 0;

    danglingNodes.forEach((node) => {
      const idx = nodeIndexMap.get(node);
      danglingScore += pageRank[idx];
    });

    danglingScore /= nodeCount;

    const newPageRank = new Array(nodeCount).fill(0);

    for (let i = 0; i < nodeCount; i++) {
      const node = sortedNodes[i];
      let score = 0;
      const sources = inLinks[node] || [];

      sources.forEach((src) => {
        score += pageRank[nodeIndexMap.get(src)] / outLinks[src].length;
      });

      newPageRank[i] = d * (score + danglingScore) + (1 - d) / nodeCount;
    }

    let maxDiff = 0;
    for (let i = 0; i < nodeCount; i++) {
      maxDiff = Math.max(maxDiff, Math.abs(newPageRank[i] - pageRank[i]));
    }

    if (maxDiff < Tolerance) break;

    pageRank = newPageRank;
  }

  return sortedNodes.map((node, idx) => pageRank[idx].toExponential(10));
};
