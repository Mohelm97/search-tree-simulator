import Konva from "konva";
import InfoBox from "./ui/infoBox";
import SimulationOptions from "./ui/simulationOptions";
import ExportImportBox from "./ui/exportImportBox";
import SimulationControl from "./ui/simulationControl";
import SimulationLegend from "./ui/simulationLegend";
import Grid from "./grid";
import sampleGraph from "./samples/sampleGraph";
import Simulator from "./simulator";
import "./styles/main.css";
import ContextMenu from "./ui/contextMenu";

const sceneWidth = window.innerWidth;
const sceneHeight = window.innerHeight;

const stage = new Konva.Stage({
    container: "container",
    width: sceneWidth,
    height: sceneHeight,
    draggable: true,
});
stage.position({ x: sceneWidth / 2, y: sceneHeight / 2 });
PointerEvent.prototype.globalX = function () {
    return this.x - stage.x();
};
PointerEvent.prototype.globalY = function () {
    return this.y - stage.y();
};

const gridLayer = new Grid(15, stage);
const connectionsLayer = new Konva.Layer();
const nodesLayer = new Konva.Layer();

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

new ContextMenu(stage, nodesLayer, connectionsLayer);
new InfoBox(stage, nodesLayer);
const simulationLegend = new SimulationLegend();
const simulationControl = new SimulationControl();
const simulationOptions = new SimulationOptions(nodesLayer, () => {
    const simulator = new Simulator(nodesLayer, connectionsLayer, simulationOptions.startNode, simulationOptions.goalNode, simulationOptions.codeWindow.getCode());
    simulationControl.setSimulator(simulator);
    simulationLegend.show();
    if (simulationControl.isHidden()) {
        simulationControl.show();
    } else {
        simulationControl.hide();
        setTimeout(() => {
            simulationControl.show();
        }, 200);
    }

    simulator.on("end", () => {
        simulationLegend.hide();
    });
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
    gridLayer.createGrid();
}

fitStageIntoParentContainer();
window.addEventListener("resize", fitStageIntoParentContainer);
