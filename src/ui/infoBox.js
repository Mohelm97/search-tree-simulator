import Konva from "konva";
import Accordion from "./accordion";

export default class InfoBox extends Accordion {
    /**
     *
     * @param {Konva.Stage} stage
     * @param {Konva.Layer} nodesLayer
     */
    constructor(stage, nodesLayer) {
        const parent = document.getElementById("ui-overlay");
        super(
            parent,
            "Info",
            `Mouse: <span class="data" id="mouse-position">(0,0)</span><br/>
            Selected Node: <span class="data" id="selected-node">-</span>`
        );
        this.accordion.style.bottom = "10px";
        this.accordion.style.right = "10px";

        const mousePositon = this.accordion.querySelector("#mouse-position");
        stage.on("pointermove", (e) => {
            mousePositon.innerText = `(${Math.round(e.evt.x - e.currentTarget.attrs.x)}, ${Math.round(e.evt.y - e.currentTarget.attrs.y)})`;
        });
        const selectedNode = this.accordion.querySelector("#selected-node");
        nodesLayer.on("nodeclick", (node) => {
            selectedNode.innerText = node.name;
        });
    }
}
