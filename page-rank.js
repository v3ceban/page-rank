import fs from "fs";

function main() {
  const args = process.argv.slice(2);
  const inputFile = args[0];
  const d = parseFloat(args[1]);

  const data = fs
    .readFileSync(inputFile, "utf8")
    .split("\n")
    .filter((line) => line.trim() !== "");

  const adjacency = {};
  const inlinks = {};
  const nodesSet = new Set();

  for (const line of data) {
    const [sourceStr, targetsStr] = line.split(":");
    const source = parseInt(sourceStr.trim());
    nodesSet.add(source);
    const targets = targetsStr
      .trim()
      .split(",")
      .map((t) => parseInt(t.trim()));
    adjacency[source] = targets;
    targets.forEach((target) => {
      nodesSet.add(target);
      if (!inlinks[target]) {
        inlinks[target] = [];
      }
      inlinks[target].push(source);
    });
  }

  const sortedNodes = Array.from(nodesSet).sort((a, b) => a - b);
  const n = sortedNodes.length;
  const nodeIndexMap = new Map();
  sortedNodes.forEach((node, index) => nodeIndexMap.set(node, index));

  const sinks = sortedNodes.filter((node) => {
    const edges = adjacency[node];
    return !edges || edges.length === 0;
  });

  let pr = new Array(n).fill(1 / n);
  const epsilon = 1e-10;

  while (true) {
    let S = 0;
    sinks.forEach((sink) => {
      const sinkIndex = nodeIndexMap.get(sink);
      S += pr[sinkIndex];
    });
    S /= n;

    const newPR = new Array(n).fill(0);
    for (let jIndex = 0; jIndex < n; jIndex++) {
      const j = sortedNodes[jIndex];
      let sum_inlinks = 0;
      const ilist = inlinks[j] || [];
      for (const i of ilist) {
        const iIndex = nodeIndexMap.get(i);
        const L_i = adjacency[i].length;
        sum_inlinks += pr[iIndex] / L_i;
      }
      newPR[jIndex] = d / n + (1 - d) * (sum_inlinks + S);
    }

    let maxDiff = 0;
    for (let i = 0; i < n; i++) {
      maxDiff = Math.max(maxDiff, Math.abs(newPR[i] - pr[i]));
    }
    if (maxDiff < epsilon) break;

    pr = newPR;
  }

  const outputFile = args[2];
  const output = sortedNodes
    .map((_node, index) => pr[index].toExponential(10))
    .join("\n");

  fs.writeFileSync(outputFile, output, "utf8");
}

main();
