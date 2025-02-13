#!/usr/bin/env node

/**
 * @fileoverview Dataset Generator for PageRank Testing
 *
 * CLI tool to generate random directed graph datasets for testing PageRank algorithm.
 * Creates a text file with node relationships in the format "source:target1,target2,...".
 * Includes features like dangling nodes and random edge distribution.
 *
 * @author Vladimir Ceban
 * @license GNU GPL v3
 */

import fs from "fs";

/**
 * Generates a random directed graph dataset for PageRank testing.
 *
 * @param {number} n - Total number of nodes in the graph (0 to n-1)
 * @param {string} filename - Path to the output file
 * @param {number} [maxOutgoing=10] - Maximum number of outgoing edges per node
 *
 * @description
 * The function generates a graph with the following characteristics:
 * - Nodes are numbered from 0 to n-1
 * - Each node has random number of outgoing edges (1 to maxOutgoing)
 * - 2% chance for a node to be a dangling node (no outgoing edges)
 *
 * @example
 * ```javascript
 * // Generate a graph with 100 nodes, max 5 outgoing edges per node
 * makeDataset(100, "test-data.txt", 5);
 * ```
 *
 * @throws {Error} If file writing fails or if stream encounters an error
 */
async function makeDataset(n, filename, maxOutgoing = 10) {
  const stream = fs.createWriteStream(filename, { encoding: "utf8" });

  const finished = new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  const writeLineWithBackpressure = async (line) => {
    if (!stream.write(line)) {
      await new Promise((resolve) => stream.once("drain", resolve));
    }
  };

  try {
    for (let i = 0; i < n; i++) {
      let line;
      if (Math.random() < 0.02) {
        line = `${i}:`;
      } else {
        const targets = new Set();
        const count = Math.floor(Math.random() * maxOutgoing) + 1;
        while (targets.size < count) {
          targets.add(Math.floor(Math.random() * n));
        }
        line = `${i}:${Array.from(targets).join(",")}`;
      }
      await writeLineWithBackpressure(line + "\n");
    }
    stream.end();
    await finished;
  } catch (error) {
    stream.destroy();
    throw error;
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    "Usage: node make-dataset.js <n> <outputFilename> [maxOutgoing]",
  );
  process.exit(1);
}

const n = parseInt(args[0], 10);
if (isNaN(n) || n <= 0) {
  console.error("n must be a positive integer");
  process.exit(1);
}

let maxOutgoing = 10;

if (args.length > 2) {
  maxOutgoing = parseInt(args[2], 10);
}
if (isNaN(maxOutgoing) || maxOutgoing <= 0) {
  console.error("maxOutgoing must be a positive integer");
  process.exit(1);
}

const filename = args[1];

makeDataset(n, filename, maxOutgoing);
