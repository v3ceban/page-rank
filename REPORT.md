# Project 1 - PageRank Algorithm

Vladimir Ceban, CSEN 169 - Web Information Management, Winter 2025.

---

In this assignment, a PageRank algorithm was implemented that can be used for ranking webpages. Below is an analysis of the results of the algorithm as its parameters are varied.

## Algorithm Description

The algorithm calculates PageRank values for a network of nodes using an iterative approach with a teleporting parameter `d` (dumping factor) that controls the probability of jumping to a random node in the network. The algorithm works as follows:

1. Builds the graph structure from input data
2. Identifies dangling nodes (nodes with no outgoing links)
3. Iteratively calculates PageRank values with a formula
4. Continues until convergence, which happens when `diff == 0`,
   butimplemented as `max diff < small tolerance epsilon (1e-10)`
   to make sure the algorithm stops.
5. Outputs the PageRank values for each node in the network
   in scientific notation with 10 decimal places

### PageRank Formula

Below is the formula used to calculate the PageRank values for each node:

`PR(p) = d*(sum(PR(i)/C(i)) + ds) + (1-d)/N`

- `PR(p)` is the PageRank of page p
- `N` is the total number of nodes
- `PR(i)` is the PageRank of nodes linking to p
- `C(i)` is the number of outbound links from node i
- `ds` is the score from dangling nodes

## Script Usage

The algorithm is implemented in JavaScript. Detailed instructions on how to run the script are provided in README.md file. Here is a brief overview:

1. Make sure you have Node.js installed and it's version 18 or later
2. Unzip the project files and navigate to the project directory
3. Execute the main script with `./main.js input.txt 0.85`, where the first argument is the input file and the second argument is the teleporting parameter (dumping factor)
4. If you wish to redirect the output of the script to a file, you can do so by running it with the following command: `./main.js input.txt 0.85 > output.txt`, where `output.txt` is the file name where the output will be written

## Report

The algorithm was tested on both small (10 nodes) and large (1,000,000 nodes) graphs, with up to 150 links per node, producing the expected results. Running the algorithm on a graph with smaller number of nodes generally resulted in longer convergence time (more iterations), while running it on a graph with a larger number of nodes resulted in a faster convergence, due to the specifics of the PageRank algorithm (spectral gap is much smaller in small graphs).

### Input Data

Below is a head and a tail of `inputs/10k.txt` graph with 10,000 nodes and up to 50 links per node, that was generated with `make-dataset.js` script:

- 0:4519, 1864, 6395, 6206, 8044, 3556, 9680, 7233, 4277, 2563, 6282, 8568, 2459, 4088, 1177, 848, 6234, 5315, 950, 4543, 3830, 7242, 9969, 8111, 3719, 4116, 3862, 3462, 1425, 3271, 7866, 2473, 1239, 5249, 4817, 282, 4477, 4616, 2111
- 1:4293, 181, 3653, 5210, 2951, 9108, 3618, 331, 2089, 9537, 4104, 2502, 8458, 9670, 9005, 2634, 9444, 7352, 8966, 2306, 3055, 3469, 8860, 1225, 4332, 4768, 8063, 9119, 9065, 410, 1592, 670, 6920, 1417, 9913, 6702, 4260, 7050, 9464, 7727
- 2:8437, 9087, 6720, 2939, 8927, 7662, 2255, 2033, 9506, 8152, 3977, 5107, 9491, 1009, 381, 863, 5178, 3841, 1089, 4065, 715, 2438, 6666, 6331, 5493, 2688, 6966, 5603, 6632, 9990, 8563, 2637, 3144, 7081, 2295, 4492, 1645, 2545, 287, 4518, 1359, 371, 6493, 9793, 2287, 2449, 1862, 4768
- 3:7569, 130, 9641, 4866, 4492, 8251, 7335, 8621, 410, 2778, 1101, 8214, 4681, 6798, 6096, 1157, 8768, 4412, 4747, 6775, 4274, 4677, 8988, 2528, 5887, 893, 7513, 2008, 3382, 4397, 9597, 3844, 1632, 6504, 5006, 1835, 4372, 652, 7573, 5853, 2721, 9064, 3420, 3154
- ...
- 9996:7707, 9471, 1401, 8969, 2099, 7681, 1808, 5516, 4048, 4509, 8576, 660, 5050, 3377, 655, 1452, 9819, 3469, 4753, 6319, 1636, 4550, 3611, 3116, 1746, 7525, 4380, 4761, 426, 4448, 7348, 5392, 8190, 4821, 8485, 5135, 2681, 8278, 3053, 991, 8201, 2465, 6678, 3428, 1312
- 9997:8656, 4377, 2034, 4499, 1571, 7676, 4399, 7459, 3840, 3080, 9500, 5871, 9482, 778, 9569, 8154, 8274, 3501, 7313, 4683, 1014, 2582, 6151, 6224, 5873, 4759, 7442, 5442, 4702, 3304, 8395, 6894, 8814, 525, 7975, 6253, 819, 4799, 5328, 6292, 5238, 2543, 6709, 9045, 3171, 873, 9247, 2416, 5155, 6663
- 9998:1272, 263, 8544, 5457, 7752, 5818, 6174, 9884, 8381, 1007, 6144, 7921, 2088, 920, 415, 9269, 2633, 3392, 4279, 9712, 659, 2224, 7453, 7964, 8363, 1574, 6168, 6983, 8700, 9724, 7160, 66, 1043, 1686, 6147, 8492
- 9999:5345, 903, 3784, 2597, 3861, 4906, 997, 4845, 6019, 135, 2611, 9483, 8035

### Convergence

I ran the algorithm on this graph with varying teleporting parameter from 0.75 to 0.95, increasing the parameter by 0.05 each time. For convergence, I used a tolerance of 1e-10 and checked the maximum difference between the PageRank values of the current and the previous iteration. On average, the algorithm converged in 13 iterations for this graph.

Below is the number of iterations each run took to converge:

- **0.75**: 12 iterations
- **0.80**: 12 iterations
- **0.85**: 13 iterations
- **0.90**: 14 iterations
- **0.95**: 14 iterations

As expected, the algorithm converges faster with a lower values of `d`, as larger values tend to decrease spectral gap. Smaller values of `d` reduce the second-largest eigenvalue of the transition matrix, which increases the spectral gap and thus the convergence speed.

### Results

Below are the top 21 nodes from the PageRank results for `inputs/10k.txt` graph with given teleporting parameter `d`:

#### d = 0.95

1.  Node: 1, PageRank: 1.7515276076e-2
2.  Node: 319, PageRank: 3.2268491076e-4
3.  Node: 5976, PageRank: 3.0360938381e-4
4.  Node: 5406, PageRank: 2.9088351370e-4
5.  Node: 8369, PageRank: 2.8844375402e-4
6.  Node: 9661, PageRank: 2.7881128602e-4
7.  Node: 1627, PageRank: 2.7579458259e-4
8.  Node: 8347, PageRank: 2.7117659314e-4
9.  Node: 2404, PageRank: 2.5742967420e-4
10. Node: 2423, PageRank: 2.5696213766e-4
11. Node: 3382, PageRank: 2.5087362447e-4
12. Node: 6803, PageRank: 2.4940944450e-4
13. Node: 6691, PageRank: 2.4549110344e-4
14. Node: 925, PageRank: 2.4528043536e-4
15. Node: 1217, PageRank: 2.4144942286e-4
16. Node: 239, PageRank: 2.3882965606e-4
17. Node: 8159, PageRank: 2.3871275274e-4
18. Node: 889, PageRank: 2.3714822218e-4
19. Node: 8521, PageRank: 2.3430085502e-4
20. Node: 7301, PageRank: 2.3362167706e-4
21. Node: 4701, PageRank: 2.3319987708e-4

#### d = 0.90

1.  Node: 1, PageRank: 1.6646854917e-2
2.  Node: 319, PageRank: 3.0775855255e-4
3.  Node: 5976, PageRank: 2.8531739106e-4
4.  Node: 5406, PageRank: 2.8367492610e-4
5.  Node: 8369, PageRank: 2.7571019233e-4
6.  Node: 9661, PageRank: 2.6547488806e-4
7.  Node: 1627, PageRank: 2.6084172951e-4
8.  Node: 8347, PageRank: 2.5792540550e-4
9.  Node: 2404, PageRank: 2.5147253934e-4
10. Node: 2423, PageRank: 2.4671444075e-4
11. Node: 6803, PageRank: 2.4456576550e-4
12. Node: 3382, PageRank: 2.4027116018e-4
13. Node: 6691, PageRank: 2.3662188414e-4
14. Node: 925, PageRank: 2.3661925465e-4
15. Node: 1217, PageRank: 2.3382353380e-4
16. Node: 239, PageRank: 2.3029114510e-4
17. Node: 8159, PageRank: 2.3016510503e-4
18. Node: 889, PageRank: 2.2764242781e-4
19. Node: 99, PageRank: 2.2615929681e-4
20. Node: 7301, PageRank: 2.2576772773e-4
21. Node: 7044, PageRank: 2.2528491216e-4

#### d = 0.85

1.  Node: 1, PageRank: 1.5773040163e-2
2.  Node: 319, PageRank: 2.9310858168e-4
3.  Node: 5406, PageRank: 2.7607035558e-4
4.  Node: 5976, PageRank: 2.6795814413e-4
5.  Node: 8369, PageRank: 2.6314336934e-4
6.  Node: 9661, PageRank: 2.5264085667e-4
7.  Node: 1627, PageRank: 2.4662592179e-4
8.  Node: 2404, PageRank: 2.4530052112e-4
9.  Node: 8347, PageRank: 2.4516071369e-4
10. Node: 6803, PageRank: 2.3935428216e-4
11. Node: 2423, PageRank: 2.3669002621e-4
12. Node: 3382, PageRank: 2.3001646501e-4
13. Node: 925, PageRank: 2.2806619693e-4
14. Node: 6691, PageRank: 2.2790630267e-4
15. Node: 1217, PageRank: 2.2622529387e-4
16. Node: 239, PageRank: 2.2195260044e-4
17. Node: 8159, PageRank: 2.2175593426e-4
18. Node: 99, PageRank: 2.1972458508e-4
19. Node: 7044, PageRank: 2.1918797587e-4
20. Node: 889, PageRank: 2.1839910802e-4
21. Node: 7301, PageRank: 2.1797077389e-4

#### d = 0.80

1.  Node: 1, PageRank: 1.4893802052e-2
2.  Node: 319, PageRank: 2.7874995360e-4
3.  Node: 5406, PageRank: 2.6808452009e-4
4.  Node: 5976, PageRank: 2.5151619278e-4
5.  Node: 8369, PageRank: 2.5077421968e-4
6.  Node: 9661, PageRank: 2.4029439555e-4
7.  Node: 2404, PageRank: 2.3890492111e-4
8.  Node: 6803, PageRank: 2.3378127021e-4
9.  Node: 1627, PageRank: 2.3311948719e-4
10. Node: 8347, PageRank: 2.3287953458e-4
11. Node: 2423, PageRank: 2.2688927486e-4
12. Node: 3382, PageRank: 2.2009500370e-4
13. Node: 925, PageRank: 2.1962179556e-4
14. Node: 6691, PageRank: 2.1934251051e-4
15. Node: 1217, PageRank: 2.1865241746e-4
16. Node: 239, PageRank: 2.1380537484e-4
17. Node: 8159, PageRank: 2.1348392201e-4
18. Node: 99, PageRank: 2.1302747866e-4
19. Node: 7044, PageRank: 2.1300202149e-4
20. Node: 7301, PageRank: 2.1023689547e-4
21. Node: 598, PageRank: 2.1009221345e-4

#### d = 0.75

1.  Node: 1, PageRank: 1.4009119862e-2
2.  Node: 319, PageRank: 2.6469745013e-4
3.  Node: 5406, PageRank: 2.5973200410e-4
4.  Node: 8369, PageRank: 2.3863258279e-4
5.  Node: 5976, PageRank: 2.3597573206e-4
6.  Node: 2404, PageRank: 2.3227727806e-4
7.  Node: 9661, PageRank: 2.2842153434e-4
8.  Node: 6803, PageRank: 2.2785285576e-4
9.  Node: 8347, PageRank: 2.2107886115e-4
10. Node: 1627, PageRank: 2.2029785015e-4
11. Node: 2423, PageRank: 2.1731211914e-4
12. Node: 925, PageRank: 2.1128676972e-4
13. Node: 1217, PageRank: 2.1110292677e-4
14. Node: 6691, PageRank: 2.1092844307e-4
15. Node: 3382, PageRank: 2.1049386869e-4
16. Node: 7044, PageRank: 2.0672556941e-4
17. Node: 99, PageRank: 2.0611068372e-4
18. Node: 239, PageRank: 2.0584008001e-4
19. Node: 8159, PageRank: 2.0534817278e-4
20. Node: 598, PageRank: 2.0469617371e-4
21. Node: 7301, PageRank: 2.0257237119e-4

### Analysis

Based on these results, we can make the following observations about top sites and PageRank vector:

#### Top Sites

Node 1 is consistently the highest‐ranked site, and many of the same nodes (e.g. 319, 5406, 5976, 8369, 9661, etc.) appear in the top 21 regardless of `d`. The relative ordering of these top nodes is quite stable as `d` changes.

#### PageRank Values of Top Sites

The absolute PageRank value for `node 1` decreases from about `1.75×10⁻²` when `d = 0.95` to about `1.40×10⁻²` when `d = 0.75`. This trend is observed for the other top nodes as well: as `d` decreases, the teleportation (random jump) component becomes more dominant, which “smooths out” the differences and makes the overall distribution more uniform. However, the ratios between the top node and the subsequent nodes (for example, node 1 vs. node 319) remain roughly similar.

#### Change in the PageRank Vector

With a higher `d` (e.g. 0.95), the link structure has more influence, so the PageRank vector is more “peaked” (i.e. more mass is concentrated on a few nodes). As `d` is lowered (e.g. to 0.75), the teleportation term contributes a larger uniform share to every node, causing the distribution to become more even. In other words, the variance in the PageRank values decreases as `d` decreases—even though the sum remains 1.

#### Other Observation

- Despite subtile changes in PageRank values, the top sites remain relatively stable across different values of `d`.
- The “gaps” between the top site and those that follow are maintained, meaning that the overall ranking order is nearly identical across the five different settings.
- As `d` decreases, the entire PageRank vector becomes slightly “flatter” because the influence of the uniform teleportation term increases, reducing the spread between high- and low-ranked nodes.

### Conclusion

Across the different teleportation factors (from 0.75 to 0.95), the PageRank algorithm produces a remarkably stable ranking among the top sites—the same nodes (like node 1 and node 319) consistently appear at the very top regardless of the value of `d`. While the absolute PageRank values decrease as `d` decreases (reflecting a greater uniform influence from the random jump component), the relative differences among the top nodes remain similar. In essence, higher `d` values produce a more "peaked" PageRank vector with greater variance (more mass concentrated on the most important nodes), whereas lower `d` values yield a flatter distribution where differences between nodes are less pronounced. Overall, these results confirm that although the damping factor influences the absolute PageRank scores and the convergence behavior, it can still reliably rank the importance of nodes in the network.
