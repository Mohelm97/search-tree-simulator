import Konva from "konva";
import textPrompt from "./ui/textPrompt";

export default class NodeShape extends Konva.Group {
    constructor({ id, name, x, y }) {
        super({
            x: x,
            y: y,
            width: 60,
            height: 60,
            offsetX: 30,
            offsetY: 30,
            draggable: true,
        });
        this.connections = [];
        this.id = id;
        this.name = name;
        this.isSelected = false;
        this.state = "Normal";
        const circle = new Konva.Circle({
            x: 30,
            y: 30,
            radius: 30,
            fill: "#007ACC",
            stroke: "#005A99",
            strokeWidth: 1,
            shadowForStrokeEnabled: false,
        });
        const text = new Konva.Text({
            text: name,
            x: 0,
            y: 0,
            width: 60,
            height: 60,
            align: "center",
            verticalAlign: "middle",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontSize: 12,
            fill: "white",
        });
        this.on("dragmove", (e) => {
            this.parent.fire("nodemove", e);
            this.fire("moved", e);
        });
        this.on("pointerclick", (e) => {
            this.parent.fire("nodeclick", this);
        });
        this.on("pointerenter", () => {
            document.body.style.cursor = "grab";
        });
        this.on("pointerleave", () => {
            document.body.style.cursor = "";
        });
        this.on("pointerdown", () => {
            document.body.style.cursor = "grabbing";
        });
        this.on("dragend", () => {
            document.body.style.cursor = "grab";
        });
        this.add(circle);
        this.add(text);
    }
    remove() {
        this.fire("removed");
        super.remove();
    }
    showRenamePrompt() {
        if (this.namePrompt) {
            this.namePrompt.querySelector("input").focus();
            return;
        }
        this.namePrompt = textPrompt({ title: `Rename ${this.name}`, placeholder: "name...", value: this.name }, (newName) => {
            this.children[1].text(newName);
            this.name = newName;
            this.namePrompt = null;
        });
    }
    setIsSelected(isSelected) {
        this.isSelected = isSelected;
    }
    getConnectionsCount() {
        return this.connections.length;
    }
    getConnectionWeight(index) {
        return this.connections[index].weight;
    }
    getConnectedNode(index) {
        return this.connections[index].getOther(this);
    }
    getConnectedNodes() {
        const result = [];
        for (const connection of this.connections) {
            result.push(connection.getOther(this));
        }
        return result;
    }
    addNote(note) {
        if (this.note) {
            this.note.text(note);
            return;
        }
        this.note = new Konva.Text({
            x: -20,
            y: 70,
            width: 100,
            align: "center",
            verticalAlign: "middle",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontSize: 12,
            fill: "white",
            text: note,
        });
        this.noteBg = new Konva.Tag({
            cornerRadius: 5,
            width: 100,
            height: this.note.height() + 10,
            fill: "#222",
            x: -20,
            y: 65,
        });
        this.add(this.noteBg);
        this.add(this.note);
    }
    removeNote() {
        this.noteBg?.remove();
        this.note?.remove();
        delete this.note;
    }
    /**
     *
     * @param {"Normal" | "InMemory" | "CurrentlyProcessing" | "NotInMemory" | "Goal" | "Start"} state
     */
    setState(state) {
        this.state = state;
        const circle = this.children[0];
        const text = this.children[1];

        switch (state) {
            case "InMemory":
                circle.setAttrs({
                    fill: "#FFC107",
                    stroke: "#FFA000",
                    strokeWidth: 2,
                    shadowColor: "#FFD54F",
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    dash: undefined,
                });
                text.fill("#ffffff");
                break;

            case "CurrentlyProcessing":
                circle.setAttrs({
                    fill: "#8E24AA",
                    stroke: "#6A1B9A",
                    strokeWidth: 2,
                    shadowColor: "#BA68C8",
                    shadowBlur: 10,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    dash: undefined,
                });
                text.fill("#ffffff");
                break;

            case "NotInMemory":
                circle.setAttrs({
                    fill: "#616161",
                    stroke: "#424242",
                    strokeWidth: 2,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    dash: [5, 5],
                });
                text.fill("#B0BEC5");
                break;

            case "Goal":
                circle.setAttrs({
                    fill: "#4CAF50",
                    stroke: "#388E3C",
                    strokeWidth: 3,
                    shadowColor: "#66BB6A",
                    shadowBlur: 15,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    dash: undefined,
                });
                text.fill("#ffffff");
                break;

            case "Start":
                circle.setAttrs({
                    fill: "#2196F3",
                    stroke: "#1976D2",
                    strokeWidth: 3,
                    shadowColor: "#64B5F6",
                    shadowBlur: 15,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    dash: undefined,
                });
                text.fill("#ffffff");
                break;

            case "Normal":
            default:
                circle.setAttrs({
                    fill: "#007ACC",
                    stroke: "#005A99",
                    strokeWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    dash: undefined,
                });
                text.fill("#ffffff");
                break;
        }
    }

    toJSON() {
        return { name: this.name, x: this.x(), y: this.y() };
    }
}
