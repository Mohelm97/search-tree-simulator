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
];
export default sampleAlgorthims;
