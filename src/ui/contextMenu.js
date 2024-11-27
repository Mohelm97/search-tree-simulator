import Konva from "konva";
import "../styles/context-menu.css";
import textPrompt from "./textPrompt";
import NodeShape from "../nodeShape";
import NodeConnection from "../nodeConnection";
export default class ContextMenu {
    /**
     *
     * @param {Konva.Stage} stage
     * @param {Konva.Layer} nodesLayer
     * @param {Konva.Layer} connectionsLayer
     */
    constructor(stage, nodesLayer, connectionsLayer) {
        this.element = document.getElementById("context-menu");
        this.ul = this.element.querySelector("ul");
        this.stage = stage;
        this.nodesLayer = nodesLayer;
        this.connectionsLayer = connectionsLayer;
        document.getElementById("container").addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.updateMenu();
            this.element.style.top = `${e.clientY}px`;
            this.element.style.left = `${e.clientX}px`;
            this.element.style.display = "block";
        });
        document.addEventListener("click", () => {
            this.element.style.display = "none";
        });
        stage.on("pointerdown", (e) => {
            this.lastPointerX = e.evt.globalX();
            this.lastPointerY = e.evt.globalY();

            this.selectedNode = null;
            if (e.target instanceof NodeShape) this.selectedNode = e.target;
            if (e.target.parent instanceof NodeShape) this.selectedNode = e.target.parent;

            this.selectedConnection = null;
            if (e.target instanceof NodeConnection) this.selectedConnection = e.target;
            if (e.target.parent instanceof NodeConnection) this.selectedConnection = e.target.parent;

            if (this.selectedNode != null) {
                this.selectedNode.setZIndex(this.selectedNode.parent.children.length - 1);
            }
        });
        this.options = [
            {
                text: "Add new node",
                isVisible: () => true,
                onClick: () => this.addNewNode(),
            },
            {
                text: "Rename node",
                isVisible: () => this.selectedNode != null,
                onClick: () => this.selectedNode.showRenamePrompt(),
            },
            {
                text: "Remove node",
                isVisible: () => this.selectedNode != null,
                onClick: () => this.selectedNode.remove(),
            },
            {
                text: "Connect",
                isVisible: () => this.selectedNode != null,
                onClick: () => this.connectNodes(),
            },
            {
                text: "Disconnect",
                isVisible: () => this.selectedConnection != null,
                onClick: () => this.selectedConnection.remove(),
            },
        ];
    }
    updateMenu() {
        this.ul.innerHTML = "";
        for (const option of this.options) {
            if (!option.isVisible()) continue;
            const ele = document.createElement("li");
            ele.innerText = option.text;
            ele.addEventListener("click", () => option.onClick());
            this.ul.append(ele);
        }
    }
    addNewNode() {
        const x = this.lastPointerX;
        const y = this.lastPointerY;
        textPrompt({ title: "Enter node name", placeholder: "name..." }, (name) => {
            const node = new NodeShape({
                id: name,
                name: name,
                x: x,
                y: y,
            });
            this.nodesLayer.add(node);
        });
    }
    connectNodes() {
        document.body.style.cursor = "pointer";
        const startNode = this.selectedNode;
        const line = new Konva.Line({
            stroke: "#ecf0f1",
            strokeWidth: 2,
            lineCap: "round",
            points: [startNode.attrs.x, startNode.attrs.y, startNode.attrs.x, startNode.attrs.y],
        });
        this.connectionsLayer.add(line);
        const dragLine = (e) => {
            line.points([startNode.attrs.x, startNode.attrs.y, e.evt.globalX(), e.evt.globalY()]);
        };
        const pointerClick = () => makeConnection(null);
        const makeConnection = (node) => {
            if (node) this.connectionsLayer.add(new NodeConnection(startNode, node, 1));
            this.nodesLayer.off("nodeclick", makeConnection);
            this.stage.off("pointermove", dragLine);
            this.stage.off("pointerclick", pointerClick);
            document.body.style.cursor = "";
            line.remove();
        };
        this.stage.on("pointerclick", pointerClick);
        this.stage.on("pointermove", dragLine);
        this.nodesLayer.on("nodeclick", makeConnection);
    }
}
