class Graph {
    constructor() {
        this.graph = new Map();
    }

    addEdge(src, dest, weight) {
        if (!this.graph.has(src)) {
            this.graph.set(src, []);
        }
        if (!this.graph.has(dest)) {
            this.graph.set(dest, []);
        }
        this.graph.get(src).push({ dest, weight });
        this.graph.get(dest).push({ dest: src, weight }); // Assuming bidirectional edges
    }

    shortestPathUsingDijkstra(src) {
        const dist = new Map();
        const prev = new Map();
        const visited = new Map();
        const pq = new PriorityQueue();

        // Initialize distances and previous nodes
        for (let node of this.graph.keys()) {
            dist.set(node, Infinity);
            prev.set(node, null);
            visited.set(node, false);
        }
        dist.set(src, 0);
        pq.enqueue({ node: src, dist: 0 });

        while (!pq.isEmpty()) {
            const { node: currNode } = pq.dequeue();

            if (visited.get(currNode)) continue;
            visited.set(currNode, true);

            if (!this.graph.has(currNode)) continue;

            for (let neighbor of this.graph.get(currNode)) {
                const { dest, weight } = neighbor;
                const alt = dist.get(currNode) + weight;

                if (alt < dist.get(dest)) {
                    dist.set(dest, alt);
                    prev.set(dest, currNode);
                    pq.enqueue({ node: dest, dist: alt });
                }
            }
        }

        return { dist, prev };
    }

    reconstructPath(start, end, prev) {
        const path = [];
        for (let at = end; at !== null; at = prev.get(at)) {
            path.push(at);
        }
        path.reverse();
        return path[0] === start ? path : [];
    }
}

class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    enqueue(item) {
        this.heap.push(item);
        this.bubbleUp();
    }

    dequeue() {
        const min = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.sinkDown(0);
        }
        return min;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const element = this.heap[index];
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIndex];
            if (element.dist >= parent.dist) break;
            this.heap[parentIndex] = element;
            this.heap[index] = parent;
            index = parentIndex;
        }
    }

    sinkDown(index) {
        let smallest = index;
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        const length = this.heap.length;

        if (left < length && this.heap[left].dist < this.heap[smallest].dist) {
            smallest = left;
        }
        if (right < length && this.heap[right].dist < this.heap[smallest].dist) {
            smallest = right;
        }

        if (smallest !== index) {
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            this.sinkDown(smallest);
        }
    }
}

// Usage example
const g = new Graph();

// Add edges
const connections = [
    ["New Delhi", "Kolkata", 1500],
    ["Varanasi", "Hyderabad", 1200],
    ["New Delhi", "Mumbai", 1400],
    ["Mumbai", "Bangalore", 980],
    ["Bangalore", "Hyderabad", 500],
    ["Kolkata", "Bhubaneswar", 440],
    ["Bhubaneswar", "Chennai", 1200],
    ["Chennai", "Bangalore", 350],
    ["Hyderabad", "Chennai", 630],
    ["Ahmedabad", "Pune", 430],
    ["Pune", "Goa", 180],
    ["Goa", "Mangalore", 320],
    ["Mangalore", "Coimbatore", 260],
    ["Coimbatore", "Madurai", 120],
    ["Madurai", "Trichy", 140],
    ["Trichy", "Thanjavur", 50],
    ["Thanjavur", "Chennai", 210],
    ["Jaipur", "Indore", 680],
    ["Indore", "Surat", 340],
    ["Surat", "Vadodara", 140],
    ["Vadodara", "Rajkot", 210],
    ["Rajkot", "Ahmedabad", 220],
    ["Guwahati", "Shillong", 350],
    ["Shillong", "Imphal", 210],
    ["Imphal", "Aizawl", 180],
    ["Aizawl", "Silchar", 240],
    ["Silchar", "Agartala", 190],
    ["Chandigarh", "Amritsar", 230],
    ["Amritsar", "Jalandhar", 80],
    ["Jalandhar", "Ludhiana", 40],
    ["Ludhiana", "Patiala", 60],
    ["Patiala", "Chandigarh", 60],
    ["Patna", "Ranchi", 420],
    ["Ranchi", "Bhubaneswar", 380],
    ["Bhubaneswar", "Raipur", 490],
    ["Raipur", "Nagpur", 260],
    ["Nagpur", "Jabalpur", 290],
    ["Jabalpur", "Bhopal", 220],
    ["Bhopal", "Indore", 240]
];

connections.forEach(connection => {
    g.addEdge(connection[0], connection[1], parseInt(connection[2]));
});

// Compute shortest path
const { dist, prev } = g.shortestPathUsingDijkstra("New Delhi");

// Reconstruct and print path
const path = g.reconstructPath("New Delhi", "Goa", prev);
if (path.length > 0) {
    console.log(path);
    console.log("cost:", dist.get("Goa"));
} else {
    console.log("No path found from New Delhi to Goa");
}
