import Konva from "konva";
import NodeShape from "./nodeShape";
import SimulationControl from "./ui/simulationControl";

export default class Simulator {
    /**
     *
     * @param {SimulationControl} simulationControl
     * @param {Konva.Layer} nodesLayer
     * @param {Konva.Layer} connectionsLayer
     * @param {NodeShape} startNode
     * @param {NodeShape} goalNode
     * @param {string} strategyCode
     */
    constructor(nodesLayer, connectionsLayer, startNode, goalNode, strategyCode) {
        this.nodesLayer = nodesLayer;
        this.connectionsLayer = connectionsLayer;
        this.startNode = startNode;
        this.goalNode = goalNode;
        this.strategyCode = strategyCode;
        this.strategyFunction = eval(strategyCode + ";strategy");
        this.currentNode = startNode;
        this.generator = this.strategyFunction(startNode, goalNode);
        this.events = {};
        for (const node of nodesLayer.children) {
            node.setState("NotInMemory");
            node.removeNote();
        }
        this.startNode.setState("Start");
        this.goalNode.setState("Goal");
    }
    on(event, handler) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(handler);
    }
    off(event, handler) {
        if (this.events[event]) this.events[event] = this.events[event].filter((h) => h !== handler);
    }
    fire(event, param) {
        if (this.events[event]) {
            for (const handler of this.events[event]) {
                handler(param);
            }
        }
    }
    reset() {
        this.currentNode = this.startNode;
        this.generator = this.strategyFunction(this.startNode, this.goalNode);
        for (const node of this.nodesLayer.children) {
            node.setState("NotInMemory");
            node.removeNote();
        }
        this.startNode.setState("Start");
        this.goalNode.setState("Goal");
        this.fire("reset");
    }
    end() {
        for (const node of this.nodesLayer.children) {
            node.setState("Normal");
        }
        this.startNode.setState("Start");
        this.goalNode.setState("Goal");
        this.fire("end");
    }
    step() {
        const nextGen = this.generator.next();
        const newNode = nextGen.value;
        if (this.currentNode?.state === "CurrentlyProcessing") this.currentNode?.setState("InMemory");
        newNode?.setState("CurrentlyProcessing");
        this.currentNode = newNode;
        if (nextGen.done) {
            this.fire("finish", newNode);
        }
    }
}
