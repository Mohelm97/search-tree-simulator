import Konva from "konva";
import NodeShape from "../nodeShape";
import NodeConnection from "../nodeConnection";
import Accordion from "./accordion";
import sampleGraph from "../samples/sampleGraph";

export default class ExportImportBox extends Accordion {
    /**
     *
     * @param {Konva.Layer} nodesLayer
     * @param {Konva.Layer} connectionsLayer
     */
    constructor(nodesLayer, connectionsLayer) {
        const parent = document.querySelector("#ui-overlay #right-side");
        super(
            parent,
            "Export/Import Graph",
            `
        <div class="form">
            <button id="export-graph">Export Graph</button>
            <button id="import-graph">Import Graph</button>
            <div style="display: flex;flex-direction: row;align-items: center;">
                <input type="checkbox" checked id="auto-save">
                <label for="auto-save" style="pointer-events:auto">Auto Save</label>
            </div>
            <button id="reset-sample">Reset Sample</button>
        </div>`
        );
        this.nodesLayer = nodesLayer;
        this.connectionsLayer = connectionsLayer;
        this.accordion.querySelector("#export-graph").addEventListener("click", () => this.exportGraphFile());
        this.accordion.querySelector("#import-graph").addEventListener("click", () => this.importGraphFile());
        this.autoSaveInterval = setInterval(this.savaToLocalStorage.bind(this), 1000);
        this.accordion.querySelector("#auto-save").addEventListener("change", (e) => {
            if (e.target.checked) {
                this.autoSaveInterval = setInterval(this.savaToLocalStorage.bind(this), 1000);
            } else if (this.autoSaveInterval) {
                clearInterval(this.autoSaveInterval);
                delete this.autoSaveInterval;
            }
        });
        this.accordion.querySelector("#reset-sample").addEventListener("click", () => {
            this.importGraph(sampleGraph);
        });
    }
    savaToLocalStorage() {
        window.localStorage.setItem("sts_graph", JSON.stringify(this.exportGraph()));
    }
    exportGraph() {
        const nodesLayer = this.nodesLayer;
        const connectionsLayer = this.connectionsLayer;
        const nodes = [];
        const connections = [];
        for (const node of nodesLayer.children) {
            if (node instanceof NodeShape) {
                nodes.push(node);
            }
        }
        for (const connection of connectionsLayer.children) {
            if (connection instanceof NodeConnection) {
                connections.push({
                    startNodeIndex: nodes.indexOf(connection.startNode),
                    endNodeIndex: nodes.indexOf(connection.endNode),
                    weight: connection.weight,
                });
            }
        }
        return {
            nodes,
            connections,
            stage: {
                x: nodesLayer.getStage().attrs.x,
                y: nodesLayer.getStage().attrs.y,
            },
        };
    }
    exportGraphFile() {
        const data = JSON.stringify(this.exportGraph());
        const a = document.createElement("a");
        a.href = `data:application/json;text,${data}`;
        a.download = "graph.json";
        a.click();
    }
    importGraph(data) {
        const nodesLayer = this.nodesLayer;
        const connectionsLayer = this.connectionsLayer;
        nodesLayer.removeChildren();
        for (const node of data.nodes) {
            nodesLayer.add(
                new NodeShape({
                    id: node.name,
                    name: node.name,
                    x: node.x,
                    y: node.y,
                })
            );
        }
        for (const connection of data.connections) {
            connectionsLayer.add(new NodeConnection(nodesLayer.children[connection.startNodeIndex], nodesLayer.children[connection.endNodeIndex], connection.weight));
        }
        nodesLayer.getStage().position(data.stage);
        nodesLayer.getStage().fire("dragmove");
    }
    importGraphFile() {
        const input = document.createElement("input");
        input.accept = ".json";
        input.type = "file";
        input.click();
        input.addEventListener("change", (e) => {
            if (input.files.length === 0) return;
            const reader = new FileReader();
            reader.onload = () => {
                this.importGraph(JSON.parse(reader.result));
            };
            reader.readAsText(input.files[0]);
        });
    }
}
