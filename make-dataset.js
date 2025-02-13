import fs from "fs";

/**
 * Generates a test input file for PageRank algorithm with random directed graph data.
 *
 * @param {number} n The number of nodes to generate in the graph
 *
 * @param {string} filename The path where the output file will be written
 *
 * @returns {void} Doesn't return anything, writes data to a file instead
 *
 * @description
 * Creates a file with n lines, where each line represents a node and its outgoing edges
 * in the format "source: target1,target2,...". The function:
 * - Generates n nodes numbered from 0 to n-1
 * - For each node, randomly selects target nodes it links to
 * - Has a 5% chance to create a dangling node (node with no outgoing edges)
 * - Avoids self-loops (nodes linking to themselves)
 * - Writes the result to the specified file in UTF-8 encoding
 *
 */
const generateInputFile = (n, filename) => {
  const lines = [];
  const nodes = Array.from({ length: n }, (_, i) => i.toString());

  for (let i = 0; i < n; i++) {
    const source = nodes[i];
    const possibleTargets =
      n === 1 ? [source] : nodes.filter((node) => node !== source);

    const numTargets = Math.max(
      0,
      Math.floor(Math.random() * possibleTargets.length),
    );

    const shuffled = possibleTargets.sort(() => 0.5 - Math.random());
    const selectedTargets = shuffled.slice(0, numTargets);

    if (Math.random() < 0.05) {
      lines.push(`${source}:`);
    } else {
      lines.push(`${source}:${selectedTargets.join(",")}`);
    }
  }

  fs.writeFileSync(filename, lines.join("\n"), "utf8");
  console.log(`Generated input file '${filename}' with ${n} lines of data.`);
};

const main = () => {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error("Usage: node generate-data.js <n> <output_file>");
    process.exit(1);
  }

  const n = parseInt(args[0], 10);
  if (isNaN(n) || n <= 0) {
    console.error("n must be a positive integer");
    process.exit(1);
  }
  const outputFile = args[1];

  generateInputFile(n, outputFile);
};

main();
