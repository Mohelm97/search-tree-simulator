const sampleAlgorthims = [
    {
        name: "Breadth-first search",
        code: `const strategy = function* (startNode, goalNode) {
    const openList = [startNode];
    for (let i = 0; i < openList.length; i++) {
        const node = openList[i];
        if (node === goalNode) return node;
        yield node;
        const children = node.getConnectedNodes();
        for(const child of children) {
            if(openList.indexOf(child) === -1) openList.push(child);
        }
    }
}`,
    },
    {
        name: "Uniform-cost search",
        code: `const strategy = function* (startNode, goalNode) {
    const openList = [startNode];
    for (let i = 0; i < openList.length; i++) {
        const node = openList[i];
        if (node === goalNode) return node;
        yield node;
        const childrenCount = node.getConnectionsCount();
        const temp = [];
        for (let j = 0; j < childrenCount; j++) {
            const child = node.getConnectedNode(j);
            const weight = node.getConnectionWeight(j);
            temp.push({ node: child, weight: weight });
        }
        temp.sort((a, b) => a.weight - b.weight);
        for (const element of temp) {
            if (openList.indexOf(element.node) === -1) openList.push(element.node);
        }
    }
}`,
    },
    {
        name: "Depth-first search",
        code: `const strategy = function* (currentNode, goalNode, parent) {
    if (currentNode === goalNode) return currentNode;
    yield currentNode;
    const connectionsCount = currentNode.getConnectionsCount();
    for (let i = 0; i < connectionsCount; i++) {
        const node = currentNode.getConnectedNode(i);
        if (node === parent) continue;
        const result = yield* strategy(node, goalNode, currentNode);
        if (result !== undefined)
            return result;
    }
    currentNode.setState("NotInMemory");
}`,
    },
    {
        name: "Depth-first search (Avoid loops)",
        code: `const strategy = function* (currentNode, goalNode, visited) {
    if (currentNode === goalNode) return currentNode;
    yield currentNode;
    if (visited === undefined) visited = [];
    visited.push(currentNode);
    const connectionsCount = currentNode.getConnectionsCount();
    for (let i = 0; i < connectionsCount; i++) {
        const node = currentNode.getConnectedNode(i);
        if (visited.indexOf(node) !== -1) continue;
        const result = yield* strategy(node, goalNode, visited);
        if (result !== undefined) return result;
    }
};`,
    },
    {
        name: "Iterative deepening search",
        code: `const depthLimitedSearch = function* (currentNode, goalNode, maxLevel, level, visited) {
    if (currentNode === goalNode) return currentNode;
    yield currentNode;
    if (visited === undefined) visited = [];
    visited.push(currentNode);
    const connectionsCount = currentNode.getConnectionsCount();
    level++;
    if (level > maxLevel) return;
    for (let i = 0; i < connectionsCount; i++) {
        const node = currentNode.getConnectedNode(i);
        if (visited.indexOf(node) !== -1) continue;
        const result = yield* depthLimitedSearch(node, goalNode, maxLevel, level, visited);
        if (result !== undefined) return result;
    }
};
const strategy = function* (currentNode, goalNode) {
    const maxDepth = 5;
    for (let i = 1; i < maxDepth; i++) {
        const result = yield* depthLimitedSearch(currentNode, goalNode, i, 0, []);
        if (result !== undefined) return result;
    }
};`,
    },
    {
        name: "Greedy best-first search",
        code: `const hTable = {
    "Bucharest": {
        "Arad": 366,
        "Bucharest": 0,
        "Craiova": 160,
        "Drobeta": 242,
        "Eforie": 161,
        "Fagaras": 176,
        "Giurgiu": 77,
        "Hirsova": 151,
        "Iasi": 226,
        "Lugoj": 244,
        "Mehadia": 241,
        "Neamt": 234,
        "Oradea": 380,
        "Pitesti": 100,
        "Rimnicu Vilcea": 193,
        "Sibiu": 253,
        "Timisoara": 329,
        "Urziceni": 80,
        "Vaslui": 199,
        "Zerind": 374,
    },
};
const h = (node, goalNode) => {
    // Retrieves the heuristic value h(n) for a node relative to the goal node.
    // You can modify this function to implement custom heuristics.
    // For example, you can calculate the Euclidean distance between nodes 
    // using node.x() and node.y().
    if (hTable[goalNode.name]?.[node.name] !== undefined)
        return hTable[goalNode.name][node.name];
    return Infinity;
};
const strategy = function* (startNode, goalNode) {
    const openList = [startNode];
    const closedList = [];
    while (openList.length > 0) {
        const node = openList.shift();
        if (node === goalNode) return node;
        yield node;
        closedList.push(node);
        const children = node.getConnectedNodes();
        for (const child of children) {
            if (!openList.includes(child) && !closedList.includes(child))
                openList.push(child);
        }
        openList.sort((a, b) => h(a, goalNode) - h(b, goalNode));
    }
};`,
    },
    {
        name: "A* search",
        code: `const hTable = {
    "Bucharest": {
        "Arad": 366,
        "Bucharest": 0,
        "Craiova": 160,
        "Drobeta": 242,
        "Eforie": 161,
        "Fagaras": 176,
        "Giurgiu": 77,
        "Hirsova": 151,
        "Iasi": 226,
        "Lugoj": 244,
        "Mehadia": 241,
        "Neamt": 234,
        "Oradea": 380,
        "Pitesti": 100,
        "Rimnicu Vilcea": 193,
        "Sibiu": 253,
        "Timisoara": 329,
        "Urziceni": 80,
        "Vaslui": 199,
        "Zerind": 374,
    },
};
const h = (node, goalNode) => {
    // Retrieves the heuristic value h(n) for a node relative to the goal node.
    // You can modify this function to implement custom heuristics.
    // For example, you can calculate the Euclidean distance between nodes 
    // using node.x() and node.y().
    if (hTable[goalNode.name]?.[node.name] !== undefined)
        return hTable[goalNode.name][node.name];
    return Infinity;
};
const g = (nodeData, goalNode) => nodeData.cost;
const f = (nodeData, goalNode) => g(nodeData, goalNode) + h(nodeData.node, goalNode);
const strategy = function* (startNode, goalNode) {
    const openList = [{ cost: 0, node: startNode }];
    const closedList = [];
    while (openList.length > 0) {
        const nodeData = openList.shift();
        const node = nodeData.node;
        if (node === goalNode) return node;
        yield node;
        closedList.push(node);
        const length = node.getConnectionsCount();
        for (let i = 0; i < length; i++) {
            const child = node.getConnectedNode(i);
            const weight = node.getConnectionWeight(i);
            if (closedList.indexOf(child) === -1) {
                const cost = nodeData.cost + weight;
                openList.push({ cost: cost, node: child });
            }
        }
        openList.sort((a, b) => f(a, goalNode) - f(b, goalNode));
    }
};`,
    },
];
export default sampleAlgorthims;
