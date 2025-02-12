# PageRank

PageRank algorithm implementation in JavaScript for CSEN 169 -
Web Information Management, Santa Clara University, Winter 2025.

## main() ⇒ `void`

Reads a network graph from a text file and calculates PageRank values using a specified damping factor.
Input file format: Each line represents edges in format `source: target1,target2,...`.

### Returns

Returns `void` and prints:

- PageRank values to stdout, one per line in scientific notation
  with 10 decimal places precision.
- Error messages to stderr if:
  - Incorrect number of command line arguments
  - Input file doesn't exist
  - Input file is empty
  - Damping factor is invalid (not between 0 and 1)
  - Input file data format is invalid

Process exits with:

- 0 on success
- 1 on error (with error message to stderr)

### Example usage

```bash
# reads input.txt and calculates PageRank with damping factor 0.85, printing to stdout
node page-rank.js input.txt 0.85
```

```bash
# reads input.txt and calculates PageRank with damping factor 0.85, printing to output.txt
node page-rank.js input.txt 0.85 > output.txt
```

## getPageRank ⇒ `Array.&lt;string&gt;`

### Description

1. Builds the graph structure from input data
2. Identifies dangling nodes (nodes with no outgoing links)
3. Iteratively calculates PageRank until convergence: ideally when diff is 0,
   but realistically when max diff < a small tolerance (1e-10).
4. Uses PageRank formula: PR(p) = d \* (sum(PR(i)/C(i)) + danglingScore) + (1 - d) / N
   where:
   - PR(p) is the PageRank of page p
   - N is the total number of nodes
   - PR(i) is the PageRank of nodes linking to p
   - C(i) is the number of outbound links from node i

### Returns

`Array.&lt;string&gt;`: array of PageRank values in scientific notation with 10 decimal places,
corresponding to the nodes in the input data.

### Throws

Error if the input data contains invalid node numbers or incorrect format.

### Params

| Param  | Type                   | Description                                                                                                                                           |
| ------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data` | `Array.&lt;string&gt;` | Array of strings representing nodes in format `source:target1,target2,...`                                                                            |
| `d`    | `number`               | Damping factor (float between `0` and `1`, typically `0.85`), representing the probability of following a link (d) or jumping to a random node (1-d). |
