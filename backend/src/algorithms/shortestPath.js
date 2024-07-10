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
        this.graph.get(dest).push({ dest: src, weight });
    }

    shortestPathUsingDijkstra(src) {
        const dist = new Map();
        const prev = new Map();
        const visited = new Map();
        const pq = new PriorityQueue();

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

// initialisation
const g = new Graph();

// Dummy data
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
    ["Bhopal", "Indore", 240],
    ["Thiruvananthapuram", "Kochi", 190],
    ["Kochi", "Kozhikode", 200],
    ["Kozhikode", "Kannur", 90],
    ["Kannur", "Mangalore", 140],
    ["Dehradun", "Haridwar", 55],
    ["Haridwar", "Rishikesh", 20],
    ["Rishikesh", "Srinagar", 780],
    ["Jammu", "Srinagar", 290],
    ["Shimla", "Manali", 270],
    ["Manali", "Leh", 470],
    ["Guwahati", "Dibrugarh", 450],
    ["Dibrugarh", "Tinsukia", 80],
    ["Patna", "Gaya", 100],
    ["Gaya", "Bodh Gaya", 13],
    ["Lucknow", "Kanpur", 80],
    ["Kanpur", "Agra", 230],
    ["Agra", "Jaipur", 230],
    ["Bhubaneswar", "Puri", 60],
    ["Puri", "Konark", 35],
    ["Jodhpur", "Udaipur", 250],
    ["Udaipur", "Jaisalmer", 330],
    ["Jaisalmer", "Bikaner", 300],
    ["Bikaner", "Jaipur", 330],
    ["Gangtok", "Pelling", 70],
    ["Pelling", "Darjeeling", 110],
    ["Darjeeling", "Kalimpong", 50],
    ["Kalimpong", "Siliguri", 65],
    ["Alipurduar", "Guwahati", 220],
    ["Srinagar", "Pahalgam", 90],
    ["Pahalgam", "Gulmarg", 14],
    ["Gulmarg", "Sonmarg", 80],
    ["Sonmarg", "Kargil", 140],
    ["Ahmedabad", "Daman", 170],
    ["Daman", "Diu", 65],
    ["Diu", "Somnath", 230],
    ["Kochi", "Alappuzha", 55],
    ["Alappuzha", "Kumarakom", 25],
    ["Kumarakom", "Kovalam", 180],
    ["Kovalam", "Thiruvananthapuram", 16],
    ["Mysore", "Ooty", 120],
    ["Ooty", "Coonoor", 22],
    ["Coonoor", "Coimbatore", 60],
    ["Bhubaneswar", "Cuttack", 30],
    ["Cuttack", "Paradeep", 80],
    ["Paradeep", "Puri", 100],
    ["Ranchi", "Jamshedpur", 130],
    ["Jamshedpur", "Kolkata", 270],
    ["Indore", "Gwalior", 200],
    ["Gwalior", "Agra", 210],
    ["Chandigarh", "Dehradun", 180],
    ["Dehradun", "Mussoorie", 30],
    ["Mussoorie", "Nainital", 65],
    ["Nainital", "Kathgodam", 34],
    ["Kathgodam", "Haldwani", 22],
    ["Jammu", "Katra", 42],
    ["Shimla", "Dalhousie", 150],
    ["Dalhousie", "Khajjiar", 16],
    ["Khajjiar", "Chamba", 20],
    ["Darjeeling", "Kurseong", 30],
    ["Kurseong", "Mirik", 20],
    ["Mirik", "Lava", 50],
    ["Lava", "Loleygaon", 35],
    ["Munnar", "Thekkady", 110],
    ["Thekkady", "Alleppey", 150],
    ["Daman", "Silvassa", 15],
    ["Silvassa", "Surat", 160],
    ["Kanchipuram", "Mahabalipuram", 58],
    ["Mahabalipuram", "Pondicherry", 80],
    ["Pondicherry", "Chidambaram", 65],
    ["Chidambaram", "Kumbakonam", 40],
    ["Kumbakonam", "Thanjavur", 42],
    ["Ranakpur", "Jodhpur", 220],
    ["Aurangabad", "Shirdi", 100],
    ["Shirdi", "Nashik", 50],
    ["Nashik", "Pune", 170],
    ["Khajuraho", "Orchha", 170],
    ["Orchha", "Gwalior", 90],
    ["Hampi", "Badami", 240],
    ["Badami", "Pattadakal", 20],
    ["Pattadakal", "Aihole", 10],
    ["Kanyakumari", "Rameshwaram", 160],
    ["Rameshwaram", "Dhanushkodi", 20],
    ["Kovalam", "Poovar", 22],
    ["Poovar", "Kottayam", 130],
    ["Kottayam", "Munnar", 115],
    ["Darjeeling", "Gangtok", 100],
    ["Coorg", "Wayanad", 140],
    ["Wayanad", "Mysore", 85],
];

connections.forEach(connection => {
    g.addEdge(connection[0], connection[1], parseInt(connection[2]));
});

// Compute shortest path
var source = "Goa";
var destination = "Mumbai";
const { dist, prev } = g.shortestPathUsingDijkstra(source);

// for finding route path
const path = g.reconstructPath(source, destination, prev);
if (path.length > 0) {
    console.log(path);
    console.log("cost:", dist.get(destination));
} else {
    console.log(`No path found from ${source} to ${destination}`);
}
