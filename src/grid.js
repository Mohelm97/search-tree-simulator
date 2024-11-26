import Konva from "konva";

export default class Grid extends Konva.Layer {
    /**
     *
     * @param {number} gridSize
     * @param {Konva.Stage} stage
     */
    constructor(gridSize, stage) {
        super();
        this.gridSize = gridSize;
        this.stage = stage;
        this.position({ x: -Math.floor(stage.attrs.x / 15) * 15, y: -Math.floor(stage.attrs.y / 15) * 15 });
        stage.on("dragmove", () => {
            this.position({ x: -Math.floor(stage.attrs.x / 15) * 15, y: -Math.floor(stage.attrs.y / 15) * 15 });
        });
    }
    createGrid() {
        this.removeChildren();
        const sceneWidth = this.stage.width();
        const sceneHeight = this.stage.height();
        const gridSize = this.gridSize;
        for (let i = 0; i < sceneWidth; i += gridSize) {
            this.add(
                new Konva.Line({
                    points: [i, -15, i, sceneHeight + 15],
                    strokeWidth: 1,
                    stroke: "#666",
                })
            );
        }
        for (let i = 0; i < sceneHeight; i += gridSize) {
            this.add(
                new Konva.Line({
                    points: [-15, i, sceneWidth + 15, i],
                    strokeWidth: 1,
                    stroke: "#666",
                })
            );
        }
    }
}
