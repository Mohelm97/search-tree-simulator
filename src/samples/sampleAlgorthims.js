const sampleAlgorthims = [
    {
        name: "Depth First",
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
        name: "Breadth-first",
        code: `const strategy = function* (startNode, goalNode) {
    const openList = [startNode];
    const addChildrenToList = (node) => {
        const length = node.getConnectionsCount();
        for (let i = 0; i < length; i++) {
            const child = node.getConnectedNode(i);
            if (openList.indexOf(child) === -1) openList.push(child);
        }
    };

    for (let i = 0; i < openList.length; i++) {
        const node = openList[i];
        if (node === goalNode) return node;
        yield node;
        addChildrenToList(node);
    }
}`,
    },
];
export default sampleAlgorthims;
