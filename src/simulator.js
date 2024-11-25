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
    constructor(simulationControl, nodesLayer, connectionsLayer, startNode, goalNode, strategyCode) {
        this.nodesLayer = nodesLayer;
        this.connectionsLayer = connectionsLayer;
        this.startNode = startNode;
        this.goalNode = goalNode;
        this.strategyCode = strategyCode;
        this.strategyFunction = eval(strategyCode + ";strategy");
        this.simulationControl = simulationControl;
        this.currentNode = startNode;
        this.generator = this.strategyFunction(startNode, goalNode);
        for (const node of nodesLayer.children) {
            node.setState("NotInMemory");
        }
        this.startNode.setState("Start");
        this.goalNode.setState("Goal");
    }
    reset() {
        this.currentNode = this.startNode;
        this.generator = this.strategyFunction(this.startNode, this.goalNode);
        for (const node of this.nodesLayer.children) {
            node.setState("NotInMemory");
        }
        this.startNode.setState("Start");
        this.goalNode.setState("Goal");
        this.simulationControl.setIsFinished(false);
    }
    step() {
        const nextGen = this.generator.next();
        const newNode = nextGen.value;
        if (this.currentNode?.state === "CurrentlyProcessing") this.currentNode?.setState("InMemory");
        newNode?.setState("CurrentlyProcessing");
        this.currentNode = newNode;
        if (nextGen.done) {
            if (newNode === this.goalNode) {
                this.simulationControl.setIsFinished(true);
                console.log("Found Goal node!");
            }
        }
    }
}
