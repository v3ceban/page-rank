#!/usr/bin/node

import fs from "fs";
import { getPageRank } from "./app/page-rank.js";

/**
 * Command-line application to calculate PageRank values for a network of nodes.
 *
 * @returns {void} Prints PageRank values to stdout, one per line in
 *                 scientific notation with 10 decimal places precision.
 *                 Or prints error message to stderr if:
 *                 - Incorrect number of command line arguments
 *                 - Input file doesn't exist
 *                 - Input file is empty
 *                 - Damping factor is invalid (not between 0 and 1)
 *                 - Input file data format is invalid
 *
 * Process exits with:
 * - 0 on success
 * - 1 on error (with error message to stderr)
 *
 * @description
 * Reads a network graph from a text file and calculates PageRank values using a specified damping factor.
 * Input file format: Each line represents edges in format "source: target1,target2,...".
 *
 * @example
 * ```bash
 * node page-rank.js input.txt 0.85
 * ```
 *
 * ```bash
 * node page-rank.js input.txt 0.85 > output.txt
 * ```
 *
 * @author Vladimir Ceban
 * @license GNU GPL v3
 */

const main = () => {
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

  if (data.length === 0) {
    console.error("Input file is empty");
    process.exit(1);
  }

  try {
    const pageRank = getPageRank(data, d);

    pageRank.map((node) => {
      console.log(node);
    });

    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};

main();
