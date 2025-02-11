import fs from "fs";

function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error("Usage: node page-rank.js <input_file> <damping_factor>");
    process.exit(1);
  }

  const inputFile = args[0];
  const d = parseFloat(args[1]);

  if (!fs.existsSync(inputFile)) {
    console.error("File not found: " + inputFile);
    process.exit(1);
  }

  if (isNaN(d) || d < 0 || d > 1) {
    console.error("Damping factor must be a number between 0 and 1");
    process.exit(1);
  }

  const data = fs
    .readFileSync(inputFile, "utf8")
    .split("\n")
    .filter((line) => line.trim() !== "");

  const graph = {};
  const inlinks = {};
  const vertexSet = new Set();

  data.map((line, lineNumber) => {
    const [vertexStr, targetsStr] = line.split(":");
    if (!vertexStr || !targetsStr) {
      console.error(`Invalid input format on ${lineNumber + 1}: ${line}`);
      process.exit(1);
    }

    const vertex = parseInt(vertexStr.trim());
    if (isNaN(vertex)) {
      console.error(
        `Invalid source node on ${lineNumber + 1}: ${line} - ${vertexStr} is not a number`,
      );
      process.exit(1);
    }
    vertexSet.add(vertex);

    const targets = targetsStr
      .trim()
      .split(",")
      .map((t) => parseInt(t.trim()));
    if (targets.some((t) => isNaN(t))) {
      console.error(
        `Invalid target node on ${lineNumber + 1}: ${line} - ${targetsStr} contains non-numeric values`,
      );
      process.exit(1);
    }
    graph[vertex] = targets;

    targets.map((target) => {
      vertexSet.add(target);
      if (!inlinks[target]) {
        inlinks[target] = [];
      }
      inlinks[target].push(vertex);
    });
  });

  const sortedNodes = Array.from(vertexSet).sort((a, b) => a - b);
  const n = sortedNodes.length;
  const nodeIndexMap = new Map();
  sortedNodes.map((node, index) => nodeIndexMap.set(node, index));

  const sinks = sortedNodes.filter((node) => {
    const edges = graph[node];
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
        const L_i = graph[i].length;
        sum_inlinks += pr[iIndex] / L_i;
      }
      //newPR[jIndex] = d / n + (1 - d) * (sum_inlinks + S);
      newPR[jIndex] = d * (sum_inlinks + S) + (1 - d) / n;
    }

    let maxDiff = 0;
    for (let i = 0; i < n; i++) {
      maxDiff = Math.max(maxDiff, Math.abs(newPR[i] - pr[i]));
    }
    if (maxDiff < epsilon) break;

    pr = newPR;
  }

  sortedNodes.map((node, index) => {
    console.log(pr[index].toExponential(10));
  });

  console.log(
    "sum: " + pr.reduce((acc, val) => acc + val, 0).toExponential(10),
  );
}

main();
