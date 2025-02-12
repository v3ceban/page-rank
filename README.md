## getPageRank ⇒ <code>Array.&lt;string&gt;</code>

The algorithm:

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

**Kind**: global constant  
**Returns**: <code>Array.&lt;string&gt;</code> - Array of PageRank values in scientific notation with 10 decimal places,
corresponding to the nodes in the input data.  
**Throws**:

- <code>Error</code> If the input data contains invalid node numbers or incorrect format.

| Param | Type                              | Description                                                                                                                                       |
| ----- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| data  | <code>Array.&lt;string&gt;</code> | Array of strings representing nodes in format "source:target1,target2,...".                                                                       |
| d     | <code>number</code>               | Damping factor (float between 0 and 1, typically 0.85) that represents the probability of following a link (d) or jumping to a random node (1-d). |

## main() ⇒ <code>void</code>

Reads a network graph from a text file and calculates PageRank values using a specified damping factor.
Input file format: Each line represents edges in format "source: target1,target2,...".

**Kind**: global function  
**Returns**: <code>void</code> - Prints PageRank values to stdout, one per line in
scientific notation with 10 decimal places precision.
Or prints error message to stderr if:

- Incorrect number of command line arguments
- Input file doesn't exist
- Input file is empty
- Damping factor is invalid (not between 0 and 1)
- Input file data format is invalid

Process exits with:

- 0 on success
- 1 on error (with error message to stderr)

### Examples

```bash
node page-rank.js input.txt 0.85
```

```bash
node page-rank.js input.txt 0.85 > output.txt
```
