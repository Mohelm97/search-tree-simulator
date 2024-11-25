import Konva from "konva";
import Accordion from "./accordion";
import NodeShape from "../nodeShape";
import CodeWindow from "./codeWindow";
import sampleAlgorthims from "../samples/sampleAlgorthims";

export default class SimulationOptions extends Accordion {
    /**
     *
     * @param {Konva.Layer} nodesLayer
     */
    constructor(nodesLayer, startSimulationCallback) {
        const parent = document.querySelector("#ui-overlay #right-side");
        const algorthimsOptions = sampleAlgorthims.map((e, i) => `<option value="${i}">${e.name}</option>`);
        super(
            parent,
            "Simulation Options",
            `
        <div class="form">
            <label for="start-node">Start Node:</label>
            <button id="start-node">Select Node</button>
            <label for="goal-node">Goal Node:</label>
            <button id="goal-node">Select Node</button>
            <label for="preset-algorthim">Selection Algorthim:</label>
            <select id="preset-algorthim" value="0">${algorthimsOptions}<option value="-1">Custom</option></select>
            <button id="edit-code">Edit Code</button>
            <button id="start-simulation" disabled class="primary">Start Simulation</button>
        </div>`
        );

        this.nodesLayer = nodesLayer;
        const startNode = this.accordion.querySelector("#start-node");
        const goalNode = this.accordion.querySelector("#goal-node");
        startNode.addEventListener("click", (evt) => this.getNodeAndSetOption(evt.target, "startNode"));
        goalNode.addEventListener("click", (evt) => this.getNodeAndSetOption(evt.target, "goalNode"));
        const editCode = this.accordion.querySelector("#edit-code");
        this.codeWindow = new CodeWindow();
        editCode.addEventListener("click", () => this.codeWindow.show());
        const presetAlgorthim = this.accordion.querySelector("#preset-algorthim");
        presetAlgorthim.addEventListener("change", (e) => {
            if (presetAlgorthim.value != -1) {
                this.codeWindow.setCode(sampleAlgorthims[presetAlgorthim.value].code);
            }
        });
        this.codeWindow.setCode(sampleAlgorthims[0].code);
        this.accordion.querySelector("#start-simulation").addEventListener("click", () => startSimulationCallback());
    }
    getNodeAndSetOption(button, optionKey) {
        button.innerText = "Click on Node";
        button.disabled = true;
        /**
         *
         * @param {NodeShape} node
         */
        const getNode = (node) => {
            this[optionKey]?.setState("Normal");
            node.setState(optionKey == "startNode" ? "Start" : "Goal");
            button.innerText = `Node: ${node.name}`;
            button.disabled = undefined;
            this[optionKey] = node;
            this.nodesLayer.off("nodeclick", getNode);
            if (this.startNode && this.goalNode) this.accordion.querySelector("#start-simulation").removeAttribute("disabled");
        };
        this.nodesLayer.on("nodeclick", getNode);
    }
}
