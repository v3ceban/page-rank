# PageRank

PageRank algorithm implementation in JavaScript for CSEN 169 -
Web Information Management, Santa Clara University, Winter 2025

## Dependencies

- Node.js 18 or later

## Installation and Usage

1. Clone and cd into the repository
2. Get a dataset or generate one with

   ```bash
    node make-dataset.js 100 input.txt
   ```

   or

   ```bash
    ./make-dataset.js 100 input.txt
   ```

   or with npm

   ```bash
    npm run dataset 100 input.txt
   ```

3. Run `main.js` file with

   ```bash
   node main.js input.txt 0.85
   ```

   or

   ```bash
   ./main.js input.txt 0.85
   ```

   or with npm

   ```bash
    npm run rank input.txt 0.85
   ```

> [!IMPORTANT]
>
> **Input file format**
>
> Program expects a text graph where each line is a string that represents a single node in the following format:
>
> ```
> source:target1,target2,...
> ```
>
> where:
>
> - `source` is the source node identifier
> - `target1,target2,...` is the comma separated list of node identifiers the source node links to
>
> **Wrong input file format may results in unexpected errors**

## Functions

### main() ⇒ `void`

#### Description

Reads a network graph from a text file and calculates PageRank values using a specified damping factor

#### Params

| Param  | Type     | Description                                                                    |
| ------ | -------- | ------------------------------------------------------------------------------ |
| `args` | `string` | Command line arguments in the following order: input file path, damping factor |

#### Example usage

```bash
# reads input.txt and calculates PageRank with damping factor 0.85, printing to stdout
./page-rank.js input.txt 0.85
```

```bash
# reads input.txt and calculates PageRank with damping factor 0.85, printing to output.txt
./page-rank.js input.txt 0.85 > output.txt
```

#### Returns

Always returns `void` and prints:

- PageRank values to stdout, one per line in scientific notation
  with 10 decimal places precision.
- Error messages to stderr if:
  - Incorrect number of command line arguments
  - Input file doesn't exist
  - Input file is empty
  - Damping factor is invalid (not between 0 and 1)

Process exits with:

- 0 on success
- 1 on error (with error message to stderr)

### getPageRank ⇒ `Object`

#### Description

1. Builds the graph structure from input data
2. Identifies dangling nodes (nodes with no outgoing links)
3. Iteratively calculates PageRank until convergence: ideally when diff is 0,
   but realistically when max diff < a small tolerance (1e-10)
4. Uses PageRank formula: `PR(p) = d*(sum(PR(i)/C(i)) + ds) + (1-d)/N`
   where:
   - `PR(p)` is the PageRank of page p
   - `N` is the total number of nodes
   - `PR(i)` is the PageRank of nodes linking to p
   - `C(i)` is the number of outbound links from node i
   - `ds` is the score from dangling nodes

#### Params

| Param  | Type        | Description                                                                                            |
| ------ | ----------- | ------------------------------------------------------------------------------------------------------ |
| `data` | `string []` | Graph of nodes and their links in format `source:target1,target2,...`                                  |
| `d`    | `number`    | Represents the probability of following a link (d) or jumping to a random node (1-d). Typical d = 0.85 |

#### Returns

Given correct input dataset, returns an object with the following properties:

- `iterations: number`: Number of iterations it took until convergence
- `sum: number`: Sum of all PageRank values
- `pageRank: string[]`: PageRank values in scientific notation with 10 decimal places,
  corresponding to the nodes in the input data

### makeDataset ⇒ `void`

#### Description

Generates a random directed graph dataset suitable for PageRank testing.

The script creates nodes numbered from 0 to n-1, with random outgoing edges.
Each node is processed with the following characteristics:

- Random number of outgoing edges (1 to maxOutgoing)
- 2% chance to be a dangling node (no outgoing edges)

#### Params

| Param            | Type     | Description                                | Default |
| ---------------- | -------- | ------------------------------------------ | ------- |
| `n`              | `number` | Total number of nodes to generate          | -       |
| `outputFilename` | `string` | Path where the output file will be written | -       |
| `maxOutgoing`    | `number` | Maximum number of outgoing edges per node  | 10      |

#### Example Usage

```bash
# Generate a graph with 100 nodes using default maxOutgoing (10)
./make-dataset.js 100 input.txt

# Generate a graph with 1000 nodes and max 5 outgoing edges per node
./make-dataset.js 1000 large-input.txt 5
```

#### Output Format

Generates a text file where each line follows the format:

```
source:target1,target2,...
```

For dangling nodes (no outgoing edges), the line will be:

```
source:
```

#### Returns

- Creates the specified output file
- Exits with code 0 on success
- Exits with code 1 and prints error to stderr if:
  - Incorrect number of arguments
  - Invalid n (must be positive integer)
  - Invalid maxOutgoing (must be positive integer)
  - File writing fails
