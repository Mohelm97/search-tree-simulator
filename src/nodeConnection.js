import Konva from "konva";
import textPrompt from "./ui/textPrompt";
import NodeShape from "./nodeShape";

export default class NodeConnection extends Konva.Group {
    /**
     *
     * @param {NodeShape} startNode
     * @param {NodeShape} endNode
     * @param {number} weight
     */
    constructor(startNode, endNode, weight) {
        super();
        this.startNode = startNode;
        this.endNode = endNode;
        this.weight = weight;
        this.line = new Konva.Line({
            stroke: "#ecf0f1",
            strokeWidth: 2,
            lineCap: "round",
        });
        this.weightText = new Konva.Text({
            text: weight,
            fill: "black",
            width: 100,
            height: 100,
            align: "center",
            verticalAlign: "middle",
            hitFunc: (con, shape) => null,
        });
        const tagWidth = this.weightText.getTextWidth() + 5;
        const tagHeight = this.weightText.fontSize() + 5;
        this.tag = new Konva.Tag({
            fill: "white",
            width: tagWidth,
            height: tagHeight,
            cornerRadius: 5,
        });

        this.tag.on("pointerclick", (e) => {
            if (this.weightPrompt && this.weightPrompt.isConnected) {
                this.weightPrompt.querySelector("input").focus();
                return;
            }
            this.weightPrompt = textPrompt({ title: `Edit ${startNode.name} - ${endNode.name} weight`, placeholder: "weight...", value: this.weight, type: "number" }, (weight) => {
                if (parseInt(weight) === NaN) return;
                this.weight = parseInt(weight);
                this.weightText.text(weight);
                const tagWidth = this.weightText.getTextWidth() + 5;
                this.tag.width(tagWidth);
                this.update();
                this.weightPrompt = null;
            });
        });
        this.update();
        this.add(this.line);
        this.add(this.tag);
        this.add(this.weightText);
        this.startNode.on("moved", () => this.update());
        this.endNode.on("moved", () => this.update());
        this.startNode.on("removed", () => this.remove());
        this.endNode.on("removed", () => this.remove());
        this.startNode.connections.push(this);
        this.endNode.connections.push(this);
    }
    update() {
        const x1 = this.startNode.attrs.x;
        const y1 = this.startNode.attrs.y;
        const x2 = this.endNode.attrs.x;
        const y2 = this.endNode.attrs.y;
        this.line.points([x1, y1, x2, y2]);
        this.weightText.x((x1 + x2) / 2 - 50);
        this.weightText.y((y1 + y2) / 2 - 50);
        this.tag.x((x1 + x2) / 2 - this.tag.width() / 2);
        this.tag.y((y1 + y2) / 2 - this.tag.height() / 2);
    }
    hasNode(node) {
        return this.startNode == node || this.endNode == node;
    }
    remove() {
        let connections = this.startNode.connections;
        let index = connections.indexOf(this);
        if (index > -1) {
            connections.splice(index, 1);
        }
        connections = this.endNode.connections;
        index = connections.indexOf(this);
        if (index > -1) {
            connections.splice(index, 1);
        }
        super.remove();
    }
    getOther(node) {
        if (this.endNode === node) return this.startNode;
        return this.endNode;
    }
}
