import Accordion from "./accordion";
import "../styles/simulation-legend.css";
export default class SimulationLegend extends Accordion {
    constructor() {
        const parent = document.getElementById("ui-overlay");
        super(
            parent,
            "Simulation Legend",
            `
            <div class="legend-row"><div class="circle start"></div> Start Node</div>
            <div class="legend-row"><div class="circle currently-processing"></div> Currently Processing Node</div>
            <div class="legend-row"><div class="circle in-memory"></div> In Memory Node</div>
            <div class="legend-row"><div class="circle not-in-memory"></div> Not In Memory Node</div>
            <div class="legend-row"><div class="circle goal"></div> Goal Node</div>`
        );
        this.accordion.classList.add("hidden");
        this.accordion.style.bottom = "10px";
        this.accordion.style.left = "10px";
    }
    show() {
        this.accordion.classList.remove("hidden");
    }
    hide() {
        this.accordion.classList.add("hidden");
    }
}
