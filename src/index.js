import Konva from "konva";
import textPrompt from "./ui/textPrompt";
import contextMenu from "./ui/contextMenu";
import InfoBox from "./ui/infoBox";
import SimulationOptions from "./ui/simulationOptions";
import ExportImportBox from "./ui/exportImportBox";
import Grid from "./grid";
import NodeShape from "./nodeShape";
import NodeConnection from "./nodeConnection";
import sampleGraph from "./samples/sampleGraph";
import "./styles/main.css";
import SimulationControl from "./ui/simulationControl";
import Simulator from "./simulator";

const sceneWidth = window.innerWidth;
const sceneHeight = window.innerHeight;

var stage = new Konva.Stage({
    container: "container",
    width: sceneWidth,
    height: sceneHeight,
    draggable: true,
});
stage.position({ x: sceneWidth / 2, y: sceneHeight / 2 });
var gridLayer = new Grid(15, stage);

var connectionsLayer = new Konva.Layer();
var nodesLayer = new Konva.Layer();
let lastPointerX = 0;
let lastPointerY = 0;
let selectedNode = null;
PointerEvent.prototype.globalX = function () {
    return this.x - stage.x();
};
PointerEvent.prototype.globalY = function () {
    return this.y - stage.y();
};
stage.on("pointerdown", (e) => {
    lastPointerX = e.evt.globalX();
    lastPointerY = e.evt.globalY();
    selectedNode = null;
    if (e.target instanceof NodeShape) {
        selectedNode = e.target;
    } else if (e.target.parent instanceof NodeShape) {
        selectedNode = e.target.parent;
    }
    if (selectedNode != null) {
        selectedNode.setZIndex(selectedNode.parent.children.length - 1);
    }
});

const contextMenuOptions = [
    {
        text: "Add new node",
        isVisible: () => true,
        onClick: () => {
            const x = lastPointerX;
            const y = lastPointerY;
            textPrompt({ title: "Enter node name", placeholder: "name..." }, (name) => {
                const group = new NodeShape({
                    id: name,
                    name: name,
                    x: x,
                    y: y,
                });
                nodesLayer.add(group);
            });
        },
    },
    {
        text: "Rename node",
        isVisible: () => selectedNode != null,
        onClick: () => {
            selectedNode.showRenamePrompt();
        },
    },
    {
        text: "Remove node",
        isVisible: () => selectedNode != null,
        onClick: () => {
            selectedNode.remove();
        },
    },
    {
        text: "Connect",
        isVisible: () => selectedNode != null,
        onClick: () => {
            document.body.style.cursor = "pointer";
            const startNode = selectedNode;
            const line = new Konva.Line({
                stroke: "#ecf0f1",
                strokeWidth: 2,
                lineCap: "round",
                points: [startNode.attrs.x, startNode.attrs.y, startNode.attrs.x, startNode.attrs.y],
            });
            connectionsLayer.add(line);
            const dragLine = (e) => {
                line.points([startNode.attrs.x, startNode.attrs.y, e.evt.globalX(), e.evt.globalY()]);
            };
            const pointerClick = () => makeConnection(null);
            const makeConnection = (node) => {
                if (node) connectionsLayer.add(new NodeConnection(startNode, node, 1));
                nodesLayer.off("nodeclick", makeConnection);
                stage.off("pointermove", dragLine);
                stage.off("pointerclick", pointerClick);
                document.body.style.cursor = "";
                line.remove();
            };
            stage.on("pointerclick", pointerClick);
            stage.on("pointermove", dragLine);
            nodesLayer.on("nodeclick", makeConnection);
        },
    },
];
contextMenu(contextMenuOptions);

nodesLayer.on("nodeclick", (selectedNode) => {
    for (const node of nodesLayer.children) {
        if (node === selectedNode) {
            node.setIsSelected(true);
        } else if (node.isSelected) {
            node.setIsSelected(false);
        }
    }
});
stage.add(gridLayer);
stage.add(connectionsLayer);
stage.add(nodesLayer);
new InfoBox(stage, nodesLayer);
const simulationControl = new SimulationControl();
const simulationOptions = new SimulationOptions(nodesLayer, () => {
    simulationControl.setSimulator(new Simulator(nodesLayer, connectionsLayer, simulationOptions.startNode, simulationOptions.goalNode, simulationOptions.codeWindow.getCode()));
    simulationControl.show();
});
const exportImportBox = new ExportImportBox(nodesLayer, connectionsLayer);
if (window.localStorage.getItem("sts_graph")) {
    exportImportBox.importGraph(JSON.parse(window.localStorage.getItem("sts_graph")));
} else {
    exportImportBox.importGraph(sampleGraph);
}

function fitStageIntoParentContainer() {
    // var scale = window.innerWidth / sceneWidth;
    // stage.width(Math.min(window.innerWidth, sceneWidth * scale));
    // stage.height(Math.min(window.innerHeight, sceneHeight * scale));
    // stage.scale({ x: scale, y: scale });
    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
}

fitStageIntoParentContainer();
window.addEventListener("resize", fitStageIntoParentContainer);
